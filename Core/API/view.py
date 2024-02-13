from Core.models import DataSensor
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from Core.Utils.classesUtils import TimeUtils


class GraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSensor
        fields = [
            'date_hour', 'temperature', 'humidity', 'pressure'
        ]


class QueryData:
    @classmethod
    def query(self, pk, model, time: int):
        query = model.objects.filter(
            Q(id_sensor=pk) & Q(
                date_hour__range=(
                    TimeUtils.timeLast(time), TimeUtils.timeNow()
                )
            )
        )
        return query


class Graph24Hrs(APIView):
    def get(self, request, pk):
        dataSensor = get_object_or_404(
            QueryData.query(pk=pk, model=DataSensor, time=24),

        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph168Hrs(APIView):
    def get(self, request, pk):
        dataSensor = get_object_or_404(
            QueryData.query(pk=pk, model=DataSensor, time=24),

        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)


class Graph720Hrs(APIView):
    def get(self, request, pk):
        dataSensor = get_object_or_404(
            QueryData.query(pk=pk, model=DataSensor, time=720),

        )
        serializer = GraphSerializer(
            instance=dataSensor,
            many=True
        )
        return Response(serializer.data)
