# vim: set fileencoding=utf-8 :
from django.contrib import admin

import creators.models as models


class FashionCategoryAdmin(admin.ModelAdmin):

    list_display = ('id', 'name', 'icon')
    search_fields = ('name',)


class CreatorAdmin(admin.ModelAdmin):

    list_display = (
        'full_name',
        'gender',
        'date_of_birth',
        'contact_phone',
        'contact_email',
        'specialty',
    )
    list_filter = (
        'user',
        'date_of_birth',
        'id',
        'full_name',
        'gender',
        'contact_phone',
        'contact_email',
        'description',
        'profile_picture',
        'specialty',
        'facebook',
        'x',
        'instagram',
        'whatsApp',
    )


class FashionAdmin(admin.ModelAdmin):

    list_display = (
         'name',
        'creator',
        'description',
    )
    list_filter = (
        'creator',
        'created_at',
        'id',
        'category',
        'name',
        'description',
        'colors',
        'additinal_info',
        'order_info',
        'image',
        'thumbnail1',
        'thumbnail2',
        'thumbnail3',
    )
    search_fields = ('name',)
    date_hierarchy = 'created_at'


class ReviewRatingAdmin(admin.ModelAdmin):

    list_display = (
        'fashion',
        'user',
        'rating',
        'review_text',
        'created_at',
    )
    list_filter = (
        'fashion',
        'user',
        'created_at',
        'id',
        'rating',
        'review_text',
    )
    date_hierarchy = 'created_at'


class CreatorReviewRatingAdmin(admin.ModelAdmin):

    list_display = (
        'creator',
        'user',
        'rating',
        'review_text',
        'created_at',
    )
    list_filter = (
        'creator',
        'user',
        'created_at',
        'id',
        'rating',
        'review_text',
    )
    date_hierarchy = 'created_at'


class LikeAdmin(admin.ModelAdmin):

    list_display = ('id', 'fashion', 'user')
    list_filter = ('fashion', 'user', 'id')


class CommentAdmin(admin.ModelAdmin):

    list_display = ('id', 'fashion', 'user', 'text', 'created_at')
    list_filter = ('fashion', 'user', 'created_at', 'id', 'text')
    date_hierarchy = 'created_at'


class FollowingAdmin(admin.ModelAdmin):

    list_display = ('id', 'creator', 'user', 'started_at')
    list_filter = ('creator', 'user', 'started_at', 'id')


class FavoriteAdmin(admin.ModelAdmin):

    list_display = ('id', 'fashion', 'user', 'updated_at')
    list_filter = ('fashion', 'user', 'updated_at', 'id')
    date_hierarchy = 'updated_at'


def _register(model, admin_class):
    admin.site.register(model, admin_class)


_register(models.FashionCategory, FashionCategoryAdmin)
_register(models.Creator, CreatorAdmin)
_register(models.Fashion, FashionAdmin)
_register(models.ReviewRating, ReviewRatingAdmin)
_register(models.CreatorReviewRating, CreatorReviewRatingAdmin)
_register(models.Like, LikeAdmin)
_register(models.Comment, CommentAdmin)
_register(models.Following, FollowingAdmin)
_register(models.Favorite, FavoriteAdmin)
