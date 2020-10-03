from django.urls import path

from forum import views
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('api/posts/<post_id>/comments/', views.CommentViewSet.as_view(), name='post_comments'),
    # path('api/private/', views.VIPView.as_view(), name='demo_private'),
    # path('api/user/', views.UserInfoView.as_view(), name='user_info'),
]


router = DefaultRouter()

router.register('api/posts', views.PostViewSet, basename='post')
urlpatterns += router.urls
