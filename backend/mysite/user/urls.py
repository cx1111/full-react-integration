from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path('api/public/', views.HelloView.as_view(), name='demo_public'),
    path('api/private/', views.VIPView.as_view(), name='demo_private'),

    path('api/token/', TokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/token/blacklist/', views.BlacklistTokenView.as_view(), name='blacklist_token'),

    path('api/user/', views.UserInfoView.as_view(), name='user_info'),
    path('register/', views.RegisterView.as_view(), name='register'),
]
