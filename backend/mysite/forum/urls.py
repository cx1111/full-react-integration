from django.urls import path

from forum import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('api/posts/<post_id>/comments/', views.CommentViewSet.as_view(), name='post_comments'),
    path('api/comment/<comment_id>/replies/', views.CommentRepliesViewSet.as_view(), name='comment_replies'),

    path('api/comment/<pk>/', views.CommentView.as_view(), name='comment'),
    path('api/comment/create/', views.CreateCommentView.as_view(), name='create_comment'),

    # path('api/private/', views.VIPView.as_view(), name='demo_private'),
    # path('api/user/', views.UserInfoView.as_view(), name='user_info'),
]


router = DefaultRouter()

router.register('api/posts', views.PostViewSet, basename='post')
urlpatterns += router.urls
