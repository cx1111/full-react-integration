from django.conf import settings
from django.http import HttpResponseBadRequest

from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

from forum.models import Comment, Post
from forum.serializers import CommentReadSerializer, CommentWriteSerializer, PostSerializer


# class PostView(APIView):
#     """
#     View or edit (or delete?) a post
#     """

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for viewing a set of posts
    """
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get_queryset(self):
        """
        Optionally filters posts by the `username` query parameter
        """
        queryset = Post.objects.all()
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(author__username=username)
        return queryset


class CommentViewSet(APIView):
    """
    Show comments for a post

    Request params:
    - is_reply: boolean, optional
    """
    def get(self, request, post_id):
        post = Post.objects.filter(id=post_id).first()

        if not post:
            return HttpResponseBadRequest("No post with specified id")

        comments = Comment.objects.filter(post=post).order_by('created_at')
        # TODO: boolean type
        is_reply = request.query_params.get('is_reply')
        if is_reply is not None:
            comments = comments.filter(is_reply=is_reply)

        serializer = CommentReadSerializer(comments, many=True)
        return Response(serializer.data, status=200)


class CommentRepliesViewSet(APIView):
    """
    Get replies for a comment
    """

    def get(self, request, comment_id):
        original_comment = Comment.objects.filter(id=comment_id).first()

        if not original_comment:
            return HttpResponseBadRequest("No comment with specified id")

        comments = original_comment.replies.all().order_by('created_at')
        serializer = CommentReadSerializer(comments, many=True)
        return Response(serializer.data, status=200)


class CommentView(APIView):
    """
    Create a comment

    Request params:
    - content
    -
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = JSONParser().parse(request)
        data['author'] = request.user.id
        serializer = CommentWriteSerializer(data=data)
        if serializer.is_valid():
            breakpoint()
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
