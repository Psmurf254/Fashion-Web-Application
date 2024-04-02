from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('customUser.urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('creators.urls')),
    path('api/', include('info.urls')),
    path('api/', include('rest_framework.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += [re_path(r'^$', TemplateView.as_view(template_name='index.html'))]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
