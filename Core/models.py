from django.db import models


class Localization(models.Model):
    id_loc = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    neighborhood = models.CharField(max_length=100)
    coordinate = models.CharField(
        max_length=100, null=True, blank=True, unique=True,
        default='Sem Coordenadas...'
    )


class Sensor(models.Model):
    id_sen = models.AutoField(primary_key=True)
    mac = models.CharField(max_length=20, unique=True, null=False)
    id_localization = models.ForeignKey(
        'Localization', on_delete=models.SET_NULL, null=True
    )


class DataSensor(models.Model):
    id_data_sensor = models.AutoField(primary_key=True)
    date_hour = models.DateTimeField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField()
    id_sensor = models.ForeignKey(
        'Sensor', on_delete=models.CASCADE, null=False
    )
