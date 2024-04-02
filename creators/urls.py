from django.urls import path
from . import views
from .views import (
    getFashionDetails, CreatorListView, create_creator,
    CommentListCreate, CommentRetrieveUpdateDestroy,
    LikeListCreate, LikeRetrieveUpdateDestroy,
    ReviewRatingListCreate, ReviewRatingRetrieveUpdateDestroy,
    CreatorReviewRatingListCreate,
    CreatorReviewRatingRetrieveUpdateDestroy,
    FollowListCreate,
    create_creator_Review,
    create_follow,
    CreatorFollowingRetrieveUpdateDestroy,
    CurrentUserView,
    FavoriteRetrieveUpdateDestroy,
    FavoriteListCreate,
    add_favorite,



)

urlpatterns = [
    path('users/user/<int:user_id>/', views.get_user_details, name='user-details'),
    path('users/user/', CurrentUserView.as_view(), name='user_list'),
    path('categories/', views.getCategories, name='categories'),
    path('fashions/', views.getFashions, name='fashions'),
    path('fashions/fashion/create/', views.create_Fashion, name='fashions_create'),
    path('fashion-details/<int:pk>/', getFashionDetails, name='fashion-details'),
    path('fashion_update/<int:pk>/', views.update_fashion, name='update_fashion'),
    path('creators/', views.getCreators, name='creators'),
    path('creators/creator/<int:creator_id>/',
         views.get_creator_details, name='get_creator_details'),
    path('creator/account/create/', create_creator, name='creator_create'),
    path('creators/creator/', CreatorListView.as_view(), name='creator_list'),
    path('creator/update/<int:pk>/',
         views.update_and_add_create_account, name='update_creator'),

    # Comments URLs
    path('comments/', CommentListCreate.as_view(), name='comment-list-create'),
    path('comment/create/', views.create_comment, name='create_comment'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroy.as_view(),
         name='comment-retrieve-update-destroy'),


    # Likes URLs
    path('likes/', LikeListCreate.as_view(), name='like-list-create'),
    path('like/create/', views.create_Like, name='create'),
    path('likes/<int:pk>/', LikeRetrieveUpdateDestroy.as_view(),
         name='like-retrieve-update-destroy'),

    # Review Ratings URLs
    path('review-ratings/', ReviewRatingListCreate.as_view(),
         name='review-rating-list-create'),
    path('review/create/', views.create_ReviewRating, name='create'),
    path('review-ratings/<int:pk>/', ReviewRatingRetrieveUpdateDestroy.as_view(),
         name='review-rating-retrieve-update-destroy'),

    # Creator Review Ratings URLs
    path('creator-ratings/', CreatorReviewRatingListCreate.as_view(),
         name='review-rating-list-create'),
    path('creator/review/create/', create_creator_Review,
         name='creator_review_create'),
    path('creator-ratings/<int:pk>/', CreatorReviewRatingRetrieveUpdateDestroy.as_view(),
         name='review-rating-retrieve-update-destroy'),

    # following
    path('creator_following/', FollowListCreate.as_view(),
         name='creator_following'),
    path('create_creator_following/', create_follow, name='create_following'),
    path('creator_following_update/<int:pk>/',
         CreatorFollowingRetrieveUpdateDestroy.as_view(), name='creator_following_update'),

    # favorite
    path('favorites/', FavoriteListCreate.as_view(), name='favorites'),
    path('add_favorite/', add_favorite, name='add_favorite'),
    path('favorite_update/<int:pk>/',
         FavoriteRetrieveUpdateDestroy.as_view(), name='favorite_update'),
]
