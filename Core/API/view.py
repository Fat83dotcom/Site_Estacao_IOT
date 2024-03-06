from django.db.models import Q
from Core.models import DataSensor
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_list_or_404
from Core.Utils.classesUtils import TimeUtils
import re
import numpy as np


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


class QueryData:
    @classmethod
    def query(self, sensor, model, time: int):
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
            QueryData.query(
                sensor=kwargs.get('sensor'), model=DataSensor, time=24
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
            QueryData.query(
                sensor=kwargs.get('sensor'), model=DataSensor, time=168
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
            QueryData.query(
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
    pass


class Stats168Hrs(APIView):
    pass
