from typing import Any
from django.db.models.query import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import View, ListView
from Core.models import Sensor


class Index(View):
    template = 'index/index.html'

    def get(self, request) -> HttpResponse:
        query = Sensor.objects.all()
        context = {
            'sensors': query
        }
        return render(request, self.template, context)


class SensorView(View):
    pass
