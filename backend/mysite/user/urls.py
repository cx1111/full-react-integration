from django.urls import path, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user import views


urlpatterns = [
    path('api/public/', views.HelloView.as_view(), name='demo_public'),
    path('api/private/', views.VIPView.as_view(), name='demo_private'),

    # TODO: Enable email login too
    path('api/token/', TokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('api/token/blacklist/', views.BlacklistTokenView.as_view(), name='blacklist_token'),

    path('api/user/', views.UserInfoView.as_view(), name='user_info'),

    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/check-activation/', views.CheckActivationTokenView.as_view(), name='check_activation_token'),

    path('api/activate/', views.ActivateUserView.as_view(), name='activate_user')

    # path('api/resend-verification/', views.ResendVerificationView.as_view(), name='resend_verification')
]
