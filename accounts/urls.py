from django.urls import path
from .views import ObtainTokenView, RefreshTokenView, ProtectedView, RegisterView

urlpatterns = [
    path('token/', ObtainTokenView.as_view(), name='token_obtain'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected_view'),
    path('register/', RegisterView.as_view(), name='register'),
]



