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


class QueryData:
    def __init__(self, model, sensor, time: int) -> None:
        self.model = model
        self.sensor = sensor
        self.time = time

    def contextQuery(self):
        return self.model.objects


class QueryDecoratorInterface:
    def __init__(self, query) -> None:
        super().__init__()
        self.queryInstance = query

    def contextQuery(self):
        return self.queryInstance.contextQuery()


class QueryFiltered(QueryDecoratorInterface):
    def __init__(self, query: QueryData) -> None:
        super().__init__(query)

    def contextQuery(self):
        querySet = super().contextQuery()
        return querySet.filter(
            Q(id_sensor=self.queryInstance.sensor) & Q(
                date_hour__range=(
                    TimeUtils.timeLast(
                        self.queryInstance.time
                    ), TimeUtils.timeNow()
                )
            )
        )


class QueryScatter24ByValue(QueryDecoratorInterface):
    def __init__(self, query: QueryData) -> None:
        super().__init__(query)

    def contextQuery(self):
        query = super().contextQuery()
        return query.values('date_hour', 'temperature', 'humidity')


class GraphScatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSensor
        fields = [
            'date_hour', 'temperature', 'humidity'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        reg = r"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-\d{2}:\d{2}"
        sub = r"\3/\2/\1 \4:\5"

        data['date_hour'] = re.sub(reg, sub, data['date_hour'])
        data['temperature'] = round(data['temperature'], 2)
        data['humidity'] = round(data['humidity'], 2)
        return data


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


class Graph24Hrs(APIView):
    model = DataSensor
    time: int = 27

    def get(self, request, *args, **kwargs):
        query = QueryFiltered(
            QueryData(self.model, kwargs.get('sensor'), self.time)
        )
        dataSensor = get_list_or_404(
            query.contextQuery()[:1440]
        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph168Hrs(APIView):
    model = DataSensor
    time: int = 171

    def get(self, request, *args, **kwargs):
        query = QueryFiltered(
            QueryData(self.model, kwargs.get('sensor'), self.time)
        )
        dataSensor = get_list_or_404(
            query.contextQuery()[:10080]
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


class ScatterGraph_24Hrs(APIView):
    model = DataSensor
    time: int = 27

    def get(self, request, *args, **kwargs):
        query = QueryScatter24ByValue(QueryFiltered(
            QueryData(self.model, kwargs.get('sensor'), self.time))
        )
        dataSensor = get_list_or_404(
            query.contextQuery()[:1440]
        )
        serializer = GraphScatterSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Stats:
    def __init__(
        self, _max: float, _min: float, average: float, stdDV: float
    ) -> None:
        self._max = _max
        self._min = _min
        self.average = average
        self.stdDV = stdDV


class StatsSerializer(serializers.Serializer):
    _max = serializers.FloatField()
    _min = serializers.FloatField()
    average = serializers.FloatField()
    stdDV = serializers.FloatField()


class StatsFactoryInterface(ABC):
    @classmethod
    @abstractmethod
    def createStats(self) -> Stats: pass


class ConcreteStats(StatsFactoryInterface):
    @classmethod
    def createStats(
        self, _max: float, _min: float, average: float, stdDV: float
    ):
        return Stats(_max, _min, average, stdDV)


class ExtractDataArrays:
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
        return round(np.max(array), 2)


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


class GenericStatsInterface(ABC):
    @abstractmethod
    def statsGenericFactory(self, sensor, time) -> list[ConcreteStats]: pass


class GenericStats(GenericStatsInterface):
    def statsGenericFactory(
        self, querySet
    ) -> list[ConcreteStats]:
        extract = ExtractDataArrays(querySet)

        return [
            ConcreteStats.createStats(
                Max.getMax(array),
                Min.getMin(array),
                Average.getAverage(array),
                StdDeviation.getStdDeviaton(array)
            )
            for array in [
                extract.getArrayTemp(),
                extract.getArrayHumi(),
                extract.getArrayPress()
            ]
        ]


class Stats24Hrs(APIView, GenericStats):
    '''
    O Postgres sempre retorna 3 horas a menos na consulta,
    não me pergunte o porquê.
    '''
    time: int = 27
    model = DataSensor

    def get(self, *args, **kwargs):
        query = QueryFiltered(QueryData(
            self.model, kwargs.get('sensor'), self.time)
        )
        querySet = query.contextQuery()

        serializer = StatsSerializer(
            instance=self.statsGenericFactory(querySet),
            many=True
        )
        return Response(serializer.data)


class Stats168Hrs(APIView, GenericStats):
    '''
    O Postgres sempre retorna 3 horas a menos na consulta,
    não me pergunte o porquê.
    '''
    time: int = 171
    model = DataSensor

    def get(self, *args, **kwargs):
        query = QueryFiltered(QueryData(
            self.model, kwargs.get('sensor'), self.time)
        )
        querySet = query.contextQuery()

        serializer = StatsSerializer(
            instance=self.statsGenericFactory(querySet),
            many=True
        )
        return Response(serializer.data)
