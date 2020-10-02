from django.conf import settings
from django.contrib.auth.tokens import default_token_generator as token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.db import transaction
from django.http import HttpResponseBadRequest
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template import loader

from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


from mysite.utils import get_url_prefix
from user.models import User
from user.serializers import ActivateUserSerializer, UserSerializer


class HelloView(APIView):
    """
    Public view for everyone
    """
    def get(self, request):
        print('yes', get_current_site(request))
        breakpoint()
        content = {'message': 'Hello'}
        return Response(content)


class VIPView(APIView):
    """
    Private view for authenticated users
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': f'Welcome private guest: {request.user.username}'}
        return Response(content)


class UserInfoView(APIView):
    """
    Returns the username if logged in, else null
    """
    def get(self, request):
        content = {
            'user': request.user.username or None,
        }
        return Response(content)


class BlacklistTokenView(APIView):
    """
    Blacklist a refresh token
    """

    def post(self, request):
        token = request.data.get('refresh')
        if not token:
            return HttpResponseBadRequest("Missing required parameter: 'refresh'")

        try:
            token = RefreshToken(token)
            token.blacklist()
        except TokenError as e:
            return HttpResponseBadRequest(str(e))

        return Response({ 'loggedOut': True})


def create_token_info(user: User):
    """
    Return the encoded base64 uid of the user, and a new activation token
    """
    uidb64 = force_text(urlsafe_base64_encode(force_bytes(
                    user.pk)))
    token = token_generator.make_token(user)
    return (uidb64, token)


def send_activation_email(request, user: User, uidb64: str, token: str):
    subject = "Mysite Email Verification"
    context = {
        'name': user.username,
        'domain': get_current_site(request),
        'url_prefix': get_url_prefix(request),
        'uidb64': uidb64,
        'token': token,
        'expire_days': settings.RESET_TIMEOUT_DAYS
    }
    body = loader.render_to_string('user/email/register_email.html', context)
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL,
        [user.email], fail_silently=False)
    return



class RegisterView(APIView):
    """
    Register a user and send a verification email.

    Request params:
    - username
    - email

    """
    permission_classes = (AllowAny,)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                uidb64, token = create_token_info(user)
                send_activation_email(request, user, uidb64, token)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class ResendActivationEmailView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return HttpResponseBadRequest("Missing required parameter: 'email'")

        user = User.objects.filter(email=email).first()

        if not user or user.is_active:
            return HttpResponseBadRequest("There is no inactive user with the specified email")

        uidb64, token = create_token_info(user)
        send_activation_email(request, user, uidb64, token)
        return Response({ 'emailSent': True }, status=200)


class CheckActivationTokenView(APIView):
    """
    Check whether a uidb64 and activation token are valid
    """

    def get(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        # TODO: Serializer
        # TODO: 200 response for invalid params?
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return HttpResponseBadRequest("No user found with the specified uid")

        if not token_generator.check_token(user, token):
            # Figure out expired or invalid in general
            return HttpResponseBadRequest("Invalid activation token")

        return Response({ "valid":True}, status=200)


class ActivateUserView(APIView):
    """
    Activate a user account

    """
    permission_classes = (AllowAny,)

    def post(self, request):
        # data = JSONParser().parse(request)
        # breakpoint()
        # uidb64 = request.data.get('uidb64')
        # token = request.data.get('token')
        # # TODO: Serializer
        # try:
        #     uid = force_text(urlsafe_base64_decode(uidb64))
        #     user = User.objects.get(pk=uid)
        # except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        #     return HttpResponseBadRequest("No user found with the specified uid")

        # if not token_generator.check_token(user, token):
        #     # Figure out expired or invalid in general
        #     return HttpResponseBadRequest("Invalid activation token")

        # breakpoint()
        data = JSONParser().parse(request)
        serializer = ActivateUserSerializer(data=data)
        if serializer.is_valid():
            serializer.activate_user()
            # with transaction.atomic():
                # TODO: serializer save
                # user.set_password(serializer.validated_data['password1'])
                # user.is_active = True
                # user.save()
            return Response({ 'activated': True}, status=201)

        return Response(serializer.errors, status=400)
