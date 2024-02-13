from django.http import HttpResponse
from django.views.generic import View
from Core.models import Sensor
from django.shortcuts import render, redirect


class Index(View):
    template = 'index/index.html'

    def get(self, request) -> HttpResponse:
        query = Sensor.objects.all()
        context = {
            'sensors': query
        }
        return render(request, self.template, context)


class SensorView(View):
    template = 'sensor/sensors.html'

    def post(self, request) -> HttpResponse:
        idSensor = request.POST.get('selectSensor')
        if 'default' in idSensor:
            return redirect(to='index')
        getAllSensors = Sensor.objects.all()
        getCurrentSensor = Sensor.objects.filter(
            id_sen=idSensor
        ).prefetch_related('id_localization')

        context = {
            'getSensors': getAllSensors,
            'currentSensor': getCurrentSensor,
        }
        return render(request, self.template, context)

    def get(self, request) -> HttpResponse:
        return redirect(to='index')


class AboutView(View):
    template = 'about/about.html'

    def get(self, request) -> HttpResponse:
        return render(request, self.template)
