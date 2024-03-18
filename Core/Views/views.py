from django.http import HttpResponse
from django.views.generic import View
from Core.models import Sensor, Pictures
from django.shortcuts import render, redirect


class Index(View):
    template = 'index/index.html'
    title = 'Home'

    def get(self, request) -> HttpResponse:
        query = Sensor.objects.all()
        context = {
            'sensors': query,
            'title': self.title
        }
        return render(request, self.template, context)


class SensorView(View):
    template = 'sensor/sensors.html'
    title = 'Sensor'

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
            'idSensor': idSensor,
            'title': self.title
        }
        return render(request, self.template, context)

    def get(self, request) -> HttpResponse:
        return redirect(to='index')


class AboutView(View):
    template = 'about/about.html'
    title = 'Sobre'

    def get(self, request) -> HttpResponse:
        images = Pictures.objects.all()
        context = {
            'images': images,
            'title': self.title,
        }
        return render(request, self.template, context)
