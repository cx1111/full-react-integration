from django.conf import settings
from django.http import HttpResponseBadRequest

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

from forum.models import Comment, Post
from forum.serializers import CommentSerializer, PostSerializer


# class PostView(APIView):
#     """
#     View or edit (or delete?) a post
#     """

# class PostsListView(APIView):
#     """
#     Show posts
#     """
#     def get(self, request):
#         posts = Post.objects.all()
#         serializer = PostSerializer(posts, many=True)
#         return Response(serializer.data, status=201)


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
            return HttpResponseBadRequest("No post with specified postId")

        comments = Comment.objects.filter(post=post).order_by('created_at')
        # TODO: boolean type
        is_reply = request.query_params.get('is_reply')
        if is_reply is not None:
            comments = comments.filter(is_reply=is_reply)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)
