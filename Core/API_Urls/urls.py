from django.urls import path
from Core.API.view import Graph24Hrs, Graph168Hrs, Stats24Hrs


urlpatterns = [
    path('data_graph_24/<int:sensor>', Graph24Hrs.as_view(), name='graph_24'),
    path(
        'data_graph_168/<int:sensor>', Graph168Hrs.as_view(), name='graph_168'
    ),
    path('data_stats_24/<int:sensor>', Stats24Hrs.as_view(), name='stats_24'),
]
