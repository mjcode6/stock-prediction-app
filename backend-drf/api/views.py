from django.shortcuts import render
from rest_framework.views import APIView
from.serialiizers import StockPredictionSerializers
from rest_framework import status
from rest_framework.response import Response
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings

# Create your views here.
class StockPredictionAPIView(APIView):
    def post(self,request):
        serializer = StockPredictionSerializers(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            
            # fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year - 10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)
         
            if df.empty:
                return Response({"error": "No data found for the given ticker.", 'status': 'status.HTTP_404_not_found'})
            df = df.reset_index()
            # Generate basic plot
            plt.switch_backend('AGG')
            plt.figure(figsize =(12,5))
            plt.plot(df.Close, label='Closing Price')
            plt.title(f"Closing price of ticker{ticker}")
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
                    
            # save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)

            plt.savefig(image_path)
            plt.close()

            plot_img = settings.MEDIA_URL + plot_img_path

            print(plot_img)

            return Response({
                'status': 'success',
                'plot_img': plot_img
            })