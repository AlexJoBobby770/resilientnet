import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_recommendations(energy_score, water_score, lpg_score, resilience_score, stress_level, lpg_days_remaining=None):
    prompt = f"""You are a resource management assistant for households in Kerala, India.

Current household resource status:
- Electricity score: {energy_score}/100
- Water score: {water_score}/100
- LPG score: {lpg_score}/100{f' (estimated {lpg_days_remaining:.0f} days remaining)' if lpg_days_remaining else ''}
- Overall Resilience Score: {resilience_score}/100
- Stress level: {stress_level}

Regional context: LPG supply disruptions are currently affecting the region.

Give exactly 3 specific, actionable recommendations for this household.
Be direct and practical. No generic advice. Each recommendation max 2 sentences.
Return only the 3 recommendations as a JSON array of strings, nothing else."""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=300
    )
    
    import json
    text = response.choices[0].message.content.strip()
    try:
        recs = json.loads(text)
    except:
        recs = [line.strip('"-• ') for line in text.split('\n') if line.strip()][:3]
    return recs