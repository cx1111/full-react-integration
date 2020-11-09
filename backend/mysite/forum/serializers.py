from datetime import datetime

from django.db import transaction
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from rest_framework import serializers

from forum.models import Post, Comment, Topic
from mysite.utils import unique
from user.serializers import UserSerializer


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'name', 'count')
        read_only_fields = ('id', 'name', 'count')


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title',
                  'author', 'topics', 'created_at')
        read_only_fields = ('id', 'author', 'created_at')


class CreatePostSerializer(serializers.ModelSerializer):
    topics = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Post
        fields = ('id', 'identifier', 'title',
                  'topics', 'author', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_topics(self, value):
        for topic in value:
            if len(topic) > Topic.MAX_CHAR_LENGTH:
                raise serializers.ValidationError(
                    f'Topics cannot be longer than {Topic.MAX_CHAR_LENGTH} characters')
        return unique(v.lower() for v in value)

    def validate_identifier(self, value):
        validator = URLValidator()
        try:
            validator(value)
        except ValidationError as invalid_identifier:
            raise serializers.ValidationError(
                'Identifier is invalid') from invalid_identifier

        return value

    def create(self, validated_data):
        """
        Create the post and attach topics
        """
        with transaction.atomic():
            post = Post.objects.create(
                identifier=validated_data['identifier'],
                title=validated_data['title'],
                author=validated_data['author']
            )

            for name in validated_data['topics']:
                post.add_topic(name)

        return post


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

    def create(self, validated_data):
        """
        Create a new comment
        """
        with transaction.atomic():
            comment = super(CreateCommentSerializer,
                            self).create(validated_data)
            comment.post.num_comments += 1
            comment.post.save()

            if comment.parent_comment:
                comment.parent_comment.num_replies += 1
                comment.parent_comment.save()

        return comment
