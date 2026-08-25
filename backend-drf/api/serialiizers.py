from rest_framework import serializers


class StockPredictionSerializers(serializers.Serializer):
    ticker = serializers.CharField(max_length =20)