from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user import views


urlpatterns = [
    # Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='obtain_token_pair'),  # TODO: Enable email login too
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/token/blacklist/', views.BlacklistTokenView.as_view(), name='blacklist_token'),

    # Registration
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/check-activation-token/', views.CheckActivationTokenView.as_view(), name='check_activation_token'),
    path('api/activate-user/', views.ActivateUserView.as_view(), name='verify_account'),
    path('api/resend-activation/', views.ResendActivationEmailView.as_view(), name='resend_activation'),

    # General
    path('api/public/', views.HelloView.as_view(), name='demo_public'),
    path('api/private/', views.VIPView.as_view(), name='demo_private'),
    path('api/user/', views.UserInfoView.as_view(), name='user_info'),
]
