from django.urls import path
from Core.API.view import Graph24Hrs, Graph168Hrs
from Core.API.view import Stats24Hrs, Stats168Hrs


urlpatterns = [
    path('data_graph_24/<int:sensor>', Graph24Hrs.as_view(), name='graph_24'),
    path(
        'data_graph_168/<int:sensor>', Graph168Hrs.as_view(), name='graph_168'
    ),
    path('data_stats_24/<int:sensor>', Stats24Hrs.as_view(), name='stats_24'),
    path(
        'data_stats_168/<int:sensor>', Stats168Hrs.as_view(), name='stats_168'
    ),
]
