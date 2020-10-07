from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

from forum.models import Comment, Post
from forum.serializers import CommentSerializer, CreateCommentSerializer, PostSerializer, CreatePostSerializer


class PostView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly,)

    # pylint: disable=arguments-differ
    def delete(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except (ValueError, Post.DoesNotExist):
            return Response({"detail": "No post with specified id"}, status=400)

        if request.user.id != post.author.id:
            return Response("Unable to delete another user's post", status=403)

        post.delete()
        return Response(status=204)


class CreatePostView(APIView):
    """
    Create a post.

    Request params:
    - identifier: str
    - title: str

    """

    def post(self, request):
        data = JSONParser().parse(request)
        data['author'] = request.user.id
        serializer = CreatePostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for viewing a set of posts

    Request params:
    - username: str, optional
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


class PostCommentsViewSet(ListAPIView):
    """
    Show top-level comments for a post

    """
    serializer_class = CommentSerializer
    queryset = Comment.objects.filter(is_reply=False)

    def get_queryset(self):
        return Comment.objects.filter(post=self.kwargs['pk'], is_reply=False).order_by('created_at')


class CommentRepliesViewSet(APIView):
    """
    Get replies for a comment
    """

    def get(self, request, pk):
        try:
            original_comment = Comment.objects.get(pk=pk)
        except (ValueError, Comment.DoesNotExist):
            return Response({"detail": "No comment with specified id"}, status=400)

        comments = original_comment.replies.all().order_by('created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)


class CommentView(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly,)

    # TODO: delete comment?
    http_method_names = ('get', 'patch')

    # pylint: disable=arguments-differ
    def patch(self, request, pk):
        """
        Update a comment.

        Request params:
        - content: str
        """
        data = JSONParser().parse(request)
        try:
            comment = Comment.objects.get(pk=pk)
        except (ValueError, Comment.DoesNotExist):
            return Response({"detail": "No comment with specified id"}, status=400)

        if request.user.id != comment.author:
            return Response("Unable to edit another user's comment", status=403)

        serializer = CommentSerializer(comment, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)


class CreateCommentView(APIView):
    """
    Create a comment.

    Request params:
    - content: str
    - post: int fk
    - is_reply: bool
    - parent_comment: int fk, optional
    """

    def post(self, request):
        data = JSONParser().parse(request)
        data['author'] = request.user.id
        serializer = CreateCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
