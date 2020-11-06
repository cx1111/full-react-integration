from datetime import datetime

from rest_framework import serializers

from forum.models import Post, Comment
from user.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title', 'author', 'created_at')
        read_only_fields = ('id',)


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title', 'author', 'created_at')
        read_only_fields = ('id', 'created_at')


class CommentSerializer(serializers.ModelSerializer):
    """
    Used for viewing one or multiple comments, including specific info about the author

    Also for editing an existing comment.
    """
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'content', 'post', 'parent_comment', 'num_replies',
                  'author', 'created_at', 'edited_at')
        read_only_fields = ('id', 'post', 'parent_comment', 'num_replies',
                            'author', 'created_at', 'edited_at')

    def update(self, instance, validated_data):
        instance.content = validated_data['content']
        instance.edited_at = datetime.now()
        return instance


class CreateCommentSerializer(serializers.ModelSerializer):
    """
    Used for creating a comment
    """

    class Meta:
        model = Comment
        fields = ('id', 'content', 'post', 'parent_comment',
                  'is_reply', 'author', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_parent_comment(self, value):
        if isinstance(value, int):
            if Comment.objects.get(id=value).is_reply:
                raise serializers.ValidationError(
                    'Unable to reply to a non top-level comment')

        return value

    # pylint: disable=arguments-differ
    def validate(self, data):
        if data['is_reply'] and data.get('parent_comment') is None:
            raise serializers.ValidationError(
                'parent_comment not specified for reply comment')

        if not data['is_reply'] and data.get('parent_comment') is not None:
            raise serializers.ValidationError(
                'parent_comment should not be specified for a non-reply comment')

        if data['is_reply'] and data.get('parent_comment'):
            if data['post'] != data['parent_comment'].post:
                raise serializers.ValidationError(
                    'Post belonging to parent_comment does not match provided post')

        return data
