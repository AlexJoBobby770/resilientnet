import pandas as pd
from prophet import Prophet

def run_forecast(data: list, periods: int = 30):
    df = pd.DataFrame(data)
    df['ds'] = pd.to_datetime(df['ds'])
    df['y'] = df['y'].astype(float)
    model = Prophet(daily_seasonality=False, weekly_seasonality=True)
    model.fit(df)
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
    return result.to_dict(orient='records')