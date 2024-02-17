from django.db.models import Q
from Core.models import DataSensor
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_list_or_404
from Core.Utils.classesUtils import TimeUtils
import re


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSensor
        fields = [
            'date_hour', 'temperature', 'humidity', 'pressure'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        reg = r"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-\d{2}:\d{2}"
        sub = r"\3/\2/\1 \4:\5:\6"
        data['date_hour'] = re.sub(reg, sub, data['date_hour'])
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
            )
        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph168Hrs(APIView):
    def get(self, request, pk):
        dataSensor = get_list_or_404(
            QueryData.query(sensor=pk, model=DataSensor, time=168),

        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph720Hrs(APIView):
    def get(self, request, pk):
        dataSensor = get_list_or_404(
            QueryData.query(sensor=pk, model=DataSensor, time=720),

        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)
