import datetime
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone
from django.http import HttpResponse
from django.views.generic import View
from Core.models import Sensor, DataSensor
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
        dataSensor24hrs = DataSensor.objects.filter(
            Q(id_sensor=idSensor) & Q(
                date_hour__range=(
                    self.timeLast(24), self.timeNow()
                )
            )
        )
        dataSensor168hrs = DataSensor.objects.filter(
            Q(id_sensor=idSensor) & Q(
                date_hour__range=(
                    self.timeLast(168), self.timeNow()
                )
            )
        )
        dataSensor720rs = DataSensor.objects.filter(
            Q(id_sensor=idSensor) & Q(
                date_hour__range=(
                    self.timeLast(720), self.timeNow()
                )
            )
        )
        context = {
            'sensors': dataSensor24hrs,
        }
        return render(request, self.template, context)

    def get(self, request) -> HttpResponse:
        return redirect(to='index')

    def timeNow(self) -> datetime:
        return timezone.now()

    def timeLast(self, hoursAgo) -> datetime:
        return self.timeNow() - timedelta(hours=hoursAgo)


class AboutView(View):
    template = 'about/about.html'

    def get(self, request) -> HttpResponse:
        return render(request, self.template)
