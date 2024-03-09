import re
import numpy as np
from django.db.models import Q
from Core.models import DataSensor
from abc import ABC, abstractmethod
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_list_or_404
from Core.Utils.classesUtils import TimeUtils


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSensor
        fields = [
            'date_hour', 'temperature', 'humidity', 'pressure'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        reg = r"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-\d{2}:\d{2}"
        sub = r"\3/\2/\1 \4:\5"

        data['date_hour'] = re.sub(reg, sub, data['date_hour'])
        data['temperature'] = round(data['temperature'], 2)
        data['humidity'] = round(data['humidity'], 2)
        data['pressure'] = round(data['pressure'], 2)
        return data


class StatsSerializer(serializers.Serializer):
    _max = serializers.FloatField()
    _min = serializers.FloatField()
    average = serializers.FloatField()
    stdDV = serializers.FloatField()


class StatsFactoryInterface(ABC):
    @abstractmethod
    def createTemperatureStats(self): pass

    @abstractmethod
    def createHUmidityStats(self): pass

    @abstractmethod
    def createPressureStats(self): pass


class ConcreteStats(StatsFactoryInterface):
    def createTemperatureStats(
        self, _max: float, _min: float, average: float, stdDV: float
    ):
        return Stats(_max, _min, average, stdDV)

    def createHUmidityStats(
        self, _max: float, _min: float, average: float, stdDV: float
    ):
        return Stats(_max, _min, average, stdDV)

    def createPressureStats(
        self, _max: float, _min: float, average: float, stdDV: float
    ):
        return Stats(_max, _min, average, stdDV)


class Stats:
    def __init__(
        self, _max: float, _min: float, average: float, stdDV: float
    ) -> None:
        self._max = _max
        self._min = _min
        self.average = average
        self.stdDV = stdDV


class ExtractData:
    def __init__(self, querySet) -> None:
        self.__temperature = []
        self.__humidity = []
        self.__pressure = []
        for data in querySet:
            self.__temperature.append(data.temperature)
            self.__humidity.append(data.humidity)
            self.__pressure.append(data.pressure)

    def getArrayTemp(self) -> np.array:
        return np.array(self.__temperature)

    def getArrayHumi(self) -> np.array:
        return np.array(self.__humidity)

    def getArrayPress(self) -> np.array:
        return np.array(self.__pressure)


class Max:
    @classmethod
    def getMax(self, array):
        return round(np.max(array))


class Min:
    @classmethod
    def getMin(self, array) -> float:
        return round(np.min(array), 2)


class Average:
    @classmethod
    def getAverage(self, array) -> float:
        return round(np.average(array), 2)


class StdDeviation:
    @classmethod
    def getStdDeviaton(self, array) -> float:
        return round(np.std(array), 2)


class QueryData:
    @classmethod
    def contextQuery(self, sensor, model, time: int):
        return model.objects.filter(
            Q(id_sensor=sensor) & Q(
                date_hour__range=(
                    TimeUtils.timeLast(time), TimeUtils.timeNow()
                )
            )
        )


class Graph24Hrs(APIView):
    def get(self, request, *args, **kwargs):
        dataSensor = get_list_or_404(
            QueryData.contextQuery(
                sensor=kwargs.get('sensor'), model=DataSensor, time=27
            )[:1440]
        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph168Hrs(APIView):
    def get(self, request, *args, **kwargs):
        dataSensor = get_list_or_404(
            QueryData.contextQuery(
                sensor=kwargs.get('sensor'), model=DataSensor, time=171
            )[:10080]
        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph720Hrs(APIView):
    def get(self, request, *args, **kwargs):
        dataSensor = get_list_or_404(
            QueryData.contextQuery(
                sensor=kwargs.get('sensor'), model=DataSensor, time=720
            )[:10080]
        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class ScatterGraph_1Hr(APIView):
    def get(self, request, *args, **kwargs):
        pass


class Stats24Hrs(APIView):
    hours: int = 27

    def get(self, *args, **kwargs):
        sensor = kwargs.get('sensor')
        querySet = QueryData.contextQuery(
            sensor, DataSensor, self.hours
        )
        extract = ExtractData(querySet)
        arrayTemp = extract.getArrayTemp()
        arrayHumi = extract.getArrayHumi()
        arrayPress = extract.getArrayPress()

        statsFactory = ConcreteStats()

        tempStats = statsFactory.createTemperatureStats(
            Max.getMax(arrayTemp),
            Min.getMin(arrayTemp),
            Average.getAverage(arrayTemp),
            StdDeviation.getStdDeviaton(arrayTemp)
        )
        humiStats = statsFactory.createHUmidityStats(
            Max.getMax(arrayHumi),
            Min.getMin(arrayHumi),
            Average.getAverage(arrayHumi),
            StdDeviation.getStdDeviaton(arrayHumi)
        )
        pressStats = statsFactory.createHUmidityStats(
            Max.getMax(arrayPress),
            Min.getMin(arrayPress),
            Average.getAverage(arrayPress),
            StdDeviation.getStdDeviaton(arrayPress)
        )

        serializer = StatsSerializer(
            instance=[tempStats, humiStats, pressStats],
            many=True
        )
        return Response(serializer.data)


class Stats168Hrs(APIView):
    pass
