from django.http import HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView


class HelloView(APIView):
    """
    Public view for everyone
    """
    def get(self, request):
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
