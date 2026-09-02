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
from .utils import save_plot




# Create your views here.
class StockPredictionAPIView(APIView):
    def post(self,request):
        from sklearn.preprocessing import MinMaxScaler
        from keras.models import load_model
        from sklearn.metrics import mean_squared_error, r2_score
        serializer = StockPredictionSerializers(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            
            # fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year - 10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)
         
            if df.empty:
                return Response({"error": "Aucune donnée disponible pour le ticker saisi.", 'status': 'status.HTTP_404_not_found'})
            df = df.reset_index()
            df = df[['Date', 'Close']].dropna()
            # Generate basic plot
            plt.switch_backend('AGG')
            plt.figure(figsize =(12,5))
            plt.plot(df.Close, label='Cours de clôture')
            plt.title(f"Cours de clôture du ticker{ticker}")
            plt.xlabel('Jours')
            plt.ylabel('Cours de clôture')
            plt.legend()
                    
            # save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            plot_img = save_plot(plot_img_path)

            # 100 Days moving average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Cours de clôture')
            plt.plot(ma100, 'r', label='Moyenne mobile à 100 jours')
            plt.title(f'Moyenne mobile à 100 jours de {ticker}')
            plt.xlabel('Jours')
            plt.ylabel('Prix')
            plt.legend()
            plot_img_path = f'{ticker}_100_dma.png'
            plot_100_dma = save_plot(plot_img_path)
            
            # 200 days moving average
            
            ma200 = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize =(12,5))
            plt.plot(df.Close, label='Cours de clôture')
            plt.plot(ma100,'r',label='Moyenne mobile à 100 jours')
            plt.plot(ma200,'g',label='Moyenne mobile à 200 jours')
            plt.title(f"Moyenne mobile à 200 jours{ticker}")
            plt.xlabel('Jours')
            plt.ylabel('Cours de clôture')
            plt.legend()           
            plot_img_path = f'{ticker}_200_dma.png'
            plot_200_dma = save_plot(plot_img_path)    
            
            
            
            # spliting data into training and testing data sets
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame( df.Close[int(len(df)*0.7):int(len(df))])   
            
            # scaling down the data between 0 and 1 
            scaler = MinMaxScaler(feature_range=(0,1))
            
            # load ml model
            model = load_model( os.path.join(settings.BASE_DIR, 'stock_prediction_model.keras'))
            
            # preparing the test data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)
            
            
            
            x_test = []
            y_test = []

            for i in range(100, input_data.shape[0]):
                    x_test.append(input_data[i-100: i])
                    y_test.append(input_data[i,0])
            x_test, y_test = np.array(x_test), np.array(y_test)

        
        # making prediction
            y_predicted = model.predict(x_test)
            
            
        # revert the scales prices to original price
            y_predicted =scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

        # plot the final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize =(12,5))
            plt.plot(y_test,'b', label='Prix réel')
            plt.plot(y_predicted,'r',label='Prix prédit')
            plt.title(f"Prédiction finale pour{ticker}")
            plt.xlabel('Jours')
            plt.ylabel('Cours de clôture')
            plt.legend()           
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_prediction = save_plot(plot_img_path)                       
                
            # Model evaluation
            
            # Mean squad error
            mse = mean_squared_error(y_test, y_predicted)
            
            # Root mean squad error
            rmse = np.sqrt(mse)
            
            # R-Squared
            r2 = r2_score(y_test,y_predicted)
           
            return Response({
                'status': 'success',
                'plot_img': plot_img,
                'plot_100_dma': plot_100_dma,
                'plot_200_dma': plot_200_dma,
                'plot_prediction': plot_prediction,
                'mse': mse,
                'rmse': rmse,
                'r2': r2,
                
            })