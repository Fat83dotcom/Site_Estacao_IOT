from django.urls import path
from Core.views import Index, SensorView


urlpatterns = [
    path('', Index.as_view(), 'index'),
    path('sensor/', SensorView.as_view(), 'sensor'),
]
