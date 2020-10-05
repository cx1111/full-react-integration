from django.http import HttpResponseBadRequest

from rest_framework.generics import GenericAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

from forum.models import Comment, Post
from forum.serializers import CommentSerializer, CommentWriteSerializer, PostSerializer


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

        serializer = CommentSerializer(comments, many=True)
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
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)


# class CommentView(APIView):

#     def get(self, request, comment_id):
#         data = JSONParser().parse(request)
#         try:
#             comment = Comment.objects.get(id=data.get('id'))
#         except:
#             return HttpResponseBadRequest("No comment with specified id")

#     def put(self, request, comment_id):
#         data = JSONParser().parse(request)
#         try:
#             comment = Comment.objects.get(id=data.get('id'))
#         except:
#             return HttpResponseBadRequest("No comment with specified id")

#         serializer = CommentSerializer(comment, data=data, partial=True)
#         if serializer.is_valid():
#             breakpoint()
#             serializer.save()
#             return Response(serializer.data, status=200)

#         return Response(serializer.errors, status=400)

class CommentView(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer

    permission_classes = (IsAuthenticatedOrReadOnly,)

    # def get_permissions(self):
    #     """
    #     Instantiates and returns the list of permissions that this view requires.
    #     """
    #     if self.request.method == 'GET':
    #         permission_classes = [IsAuthenticated]
    #     else:
    #         permission_classes = [IsAdmin]


    def get_queryset(self):
        if self.request.method == 'GET':
            return Comment.objects.all()

        return Comment.objects.filter(author=self.request.user)

    #     breakpoint()

    # def get(self, request, pk):
    #     breakpoint()
    #     data = JSONParser().parse(request)
    #     try:
    #         comment = Comment.objects.get(pk=pk)
    #     except:
    #         return HttpResponseBadRequest("No comment with specified id")

    # def put(self, request, pk):
    #     data = JSONParser().parse(request)
    #     try:
    #         comment = Comment.objects.get(id=data.get('id'))
    #     except:
    #         return HttpResponseBadRequest("No comment with specified id")

    #     serializer = CommentSerializer(comment, data=data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=200)

    #     return Response(serializer.errors, status=400)


class CreateCommentView(APIView):
    """
    Create a comment

    Request params:
    - content: str
    - post: int fk
    - is_reply: bool
    - parent_comment: int fk, optional

    TODO: Only require either post or parent_comment?
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = JSONParser().parse(request)
        data['author'] = request.user.id
        serializer = CommentWriteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
