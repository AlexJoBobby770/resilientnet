def calculate_resilience_score(electricity_kwh: float, water_liters: float, lpg_days_remaining: float):
    energy_score = min(100, max(0, (50 - electricity_kwh) / 50 * 100))
    water_score = min(100, max(0, (water_liters / 300) * 100))
    lpg_score = min(100, max(0, (lpg_days_remaining / 45) * 100))
    overall = (energy_score * 0.30) + (water_score * 0.30) + (lpg_score * 0.40)
    status = "critical" if overall < 40 else "warning" if overall < 70 else "stable"
    return {
        "overall": round(overall, 1),
        "energy": round(energy_score, 1),
        "water": round(water_score, 1),
        "lpg": round(lpg_score, 1),
        "status": status
    }