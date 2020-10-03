from rest_framework import serializers

from forum.models import Post, Comment
from user.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title', 'author', 'created_at')


class CommentSerializer(serializers.ModelSerializer):

    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('content', 'author', 'created_at', 'edited_at')

    # def create(self, validated_data):
    #     """
    #     Create a new inactive user without a password
    #     """
    #     user = User.objects.create_user(
    #         username=validated_data['username'],
    #         email=validated_data['email'],
    #         is_active=False,
    #         is_admin=False,
    #     )

    #     return user


# class ActivateUserSerializer(serializers.Serializer):
#     """
#     Validate the two passwords set by the user when activating
#     their account
#     """
#     password1 = serializers.CharField(max_length=100)
#     password2 = serializers.CharField(max_length=100)
#     uidb64 = serializers.CharField(max_length=50)
#     token = serializers.CharField(max_length=50)

#     def __init__(self, *args, **kwargs):
#         super(ActivateUserSerializer, self).__init__(args, **kwargs)
#         self.user = None

#     def validate_uidb64(self, value):
#         uid = force_text(urlsafe_base64_decode(value))
#         try:
#             user = User.objects.get(pk=uid)
#         except:
#             raise serializers.ValidationError("No user found with specified uid", code="invalid_uid")

#         if user.is_active:
#             raise serializers.ValidationError("The specified user's account has already been activated")
#         self.user = user
#         return value

#     def validate(self, data):
#         if data['password1'] != data['password2']:
#             raise serializers.ValidationError("The specified passwords do not match")

#         if not token_generator.check_token(self.user, data['token']):
#             raise serializers.ValidationError("The specified token is invalid")

#         return data

#     def activate_user(self):
#         with transaction.atomic():
#             self.user.set_password(self.validated_data['password1'])
#             self.user.is_active = True
#             self.user.save()
