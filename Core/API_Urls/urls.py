from django.urls import path
from Core.API.view import Graph24Hrs


urlpatterns = [
    path('data_graph_24/<int:sensor>', Graph24Hrs.as_view(), name='graph_24'),
]
