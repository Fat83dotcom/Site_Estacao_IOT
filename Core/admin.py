from .models import Localization, Sensor, DataSensor
from django.contrib import admin


@admin.register(Localization)
class LocalizationAdmi(admin.ModelAdmin):
    list_display = ('id_loc', 'city', 'neighborhood')


@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('owner', 'id_sen', 'mac')


@admin.register(DataSensor)
class DataSensorAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
    list_filter = ('id_sensor',)
