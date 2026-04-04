from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from forecasting import run_forecast
from recommendations import get_recommendations
from resilience import calculate_resilience_score

app = FastAPI(title="ResilientNet AI Service")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class DataPoint(BaseModel):
    ds: str
    y: float

class ForecastRequest(BaseModel):
    resource: str
    data: List[DataPoint]
    periods: int = 30

class RecommendRequest(BaseModel):
    household_id: str
    energy_score: float
    water_score: float
    lpg_score: float
    resilience_score: float
    stress_level: str
    lpg_days_remaining: float = None

class ResilienceRequest(BaseModel):
    electricity_kwh: float
    water_liters: float
    lpg_days_remaining: float

@app.get("/")
def root():
    return {"status": "ResilientNet AI Service Running"}

@app.post("/forecast")
def forecast(req: ForecastRequest):
    data = [{"ds": d.ds, "y": d.y} for d in req.data]
    predictions = run_forecast(data, req.periods)
    return {"resource": req.resource, "predictions": predictions}

@app.post("/recommend")
def recommend(req: RecommendRequest):
    recs = get_recommendations(
        req.energy_score, req.water_score, req.lpg_score,
        req.resilience_score, req.stress_level, req.lpg_days_remaining
    )
    return {"recommendations": recs}

@app.post("/resilience-score")
def resilience(req: ResilienceRequest):
    return calculate_resilience_score(req.electricity_kwh, req.water_liters, req.lpg_days_remaining)
