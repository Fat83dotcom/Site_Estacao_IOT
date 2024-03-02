from django.urls import path
from Core.API.view import Graph24Hrs, Graph168Hrs


urlpatterns = [
    path('data_graph_24/<int:sensor>', Graph24Hrs.as_view(), name='graph_24'),
    path(
        'data_graph_168/<int:sensor>', Graph168Hrs.as_view(), name='graph_168'
    ),
]
