from django.db import models
from Core.Utils.images import resizeImage


class Localization(models.Model):
    id_loc = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    neighborhood = models.CharField(max_length=100)
    coordinate = models.CharField(
        max_length=100, null=True, blank=True, unique=True,
        default='Sem Coordenadas...'
    )

    def __str__(self) -> str:
        str_ = super().__str__()
        str_ = f'{self.city} : {self.neighborhood}'
        return str_


class Sensor(models.Model):
    id_sen = models.AutoField(primary_key=True)
    owner = models.CharField(max_length=100, null=True, blank=True)
    mac = models.CharField(max_length=20, unique=True, null=False)
    id_localization = models.ForeignKey(
        'Localization', on_delete=models.SET_NULL, null=True, blank=True
    )

    def checkLocalization(self) -> bool:
        return True if self.id_localization is not None else False

    def __str__(self) -> str:
        return f'{self.id_sen} : {self.owner} -> {self.id_localization.city}' \
            if self.checkLocalization() else f'{self.id_sen} : {self.owner}'


class DataSensor(models.Model):
    id_data_sensor = models.AutoField(primary_key=True)
    date_hour = models.DateTimeField(unique=True, auto_now_add=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField()
    id_sensor = models.ForeignKey(
        'Sensor', on_delete=models.CASCADE, null=False
    )

    def __str__(self):
        str_ = f'{self.id_data_sensor}-> {self.id_sensor.id_sen}-> {self.date_hour}'
        return str_


class Pictures(models.Model):
    name = models.CharField(max_length=20, default='pic')
    picture = models.ImageField(upload_to='media')

    def __str__(self) -> str:
        return f'{self.name}'


class FavPicture(models.Model):
    name = models.CharField(max_length=20, default='pic')
    favIcon = models.ImageField(upload_to='favIcon', blank=True, null=True)

    def save(self, *args, **kwargs) -> None:
        currentFaviconName = str(self.name)
        super().save(*args, **kwargs)
        favIconChanged = currentFaviconName = False

        if self.favIcon:
            favIconChanged = currentFaviconName != self.name

        if favIconChanged:
            resizeImage(self.favIcon, 64)

    def __str__(self) -> str:
        return self.name
