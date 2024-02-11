from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Core.views import Index, SensorView


urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('sensor/', SensorView.as_view(), name='sensor'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
print(urlpatterns)
