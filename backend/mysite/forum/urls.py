from django.urls import path

from forum import views


urlpatterns = [
    path('api/create-post/', views.CreatePostView.as_view(), name='create_post'),
    path('api/post/<pk>/', views.PostView.as_view(), name='post'),
    path('api/posts/',
         views.PostViewSet.as_view({'get': 'list'}), name='list_posts'),
    path('api/post-exists/', views.PostExistsView.as_view(), name='post_exists'),

    path('api/create-comment/', views.CreateCommentView.as_view(),
         name='create_comment'),
    path('api/comment/<pk>/', views.CommentView.as_view(), name='comment'),

    path('api/post/<pk>/comments/',
         views.PostCommentsViewSet.as_view(), name='post_comments'),
    path('api/comment/<pk>/replies/',
         views.CommentRepliesViewSet.as_view(), name='comment_replies'),
]
