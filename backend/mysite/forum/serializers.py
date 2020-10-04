from rest_framework import serializers

from forum.models import Post, Comment
from user.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title', 'author', 'created_at')
        read_only_fields = ('id',)

class CommentReadSerializer(serializers.ModelSerializer):
    """
    Used for viewing one or multiple comments, including specific info about the author
    """
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'parent_comment', 'author', 'created_at', 'edited_at')
        read_only_fields = ('id', 'created_at', 'author', 'edited_at')

    def create(self, _validated_data):
        pass

    def update(self, _instance, _validated_data):
        pass


class CommentWriteSerializer(serializers.ModelSerializer):
    """
    Used for making a comment
    """

    class Meta:
        model = Comment
        fields = ('id', 'content', 'post', 'parent_comment', 'is_reply', 'author', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_parent_comment(self, value):
        if isinstance(value, int):
            if Comment.objects.get(id=value).is_reply:
                raise serializers.ValidationError('Unable to reply to a non top-level comment')

        return value

    # pylint: disable=arguments-differ
    def validate(self, data):
        if data['is_reply'] and data.get('parent_comment') is None:
            raise serializers.ValidationError('parent_comment not specified for reply comment')

        if not data['is_reply'] and data.get('parent_comment') is not None:
            raise serializers.ValidationError('parent_comment should not be specified for a non-reply comment')
        return data
