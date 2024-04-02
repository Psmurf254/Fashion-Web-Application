from django.urls import path
from . import views
from .views import CustomUserListCreateView, CustomUserRetrieveUpdateDestroyView, create_user

urlpatterns = [
    path('users/', CustomUserListCreateView.as_view(), name='user-list-create'),
    path('user/create/', create_user, name='user-list-create'),
    path('user/<int:pk>/', CustomUserRetrieveUpdateDestroyView.as_view(), name='user-retrieve-update-destroy'),
    
]
