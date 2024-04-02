# vim: set fileencoding=utf-8 :
from django.contrib import admin

import customUser.models as models


class CustomUserAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'full_name',
        'gender',
        'date_of_birth',
        'contact_phone',
        'contact_email',
        'profile_picture',
    )
    list_filter = (
        'user',
        'date_of_birth',
        'id',
        'full_name',
        'gender',
        'contact_phone',
        'contact_email',
        'profile_picture',
    )


def _register(model, admin_class):
    admin.site.register(model, admin_class)


_register(models.CustomUser, CustomUserAdmin)
