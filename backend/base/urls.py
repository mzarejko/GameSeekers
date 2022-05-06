from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf.urls.static import static
from django.conf import settings

# Swagger
schema_view = get_schema_view(
   openapi.Info(
      title="GameSeeker",
      default_version='v1',
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)
urlpatterns = [
    path('', schema_view.with_ui('swagger',
                                 cache_timeout=0), name='swagger-ui'),
    path('admin/', admin.site.urls),
    path('v1/accounts/', include('accounts.urls')),
    path('v1/room/', include('room.urls'))
]

urlpatterns + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
