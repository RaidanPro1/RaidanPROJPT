
import requests
import json
from datetime import datetime

# This script is meant to be run as a scheduled job (Cron/Celery)
# It fetches data and pushes it to the internal API or DB directly

API_BASE_URL = "http://localhost:8001/api/v1/core/ingest/webhook" # Internal Docker network address
WB_API_URL = "https://api.worldbank.org/v2/country/yem/indicator/"

INDICATORS = {
    'NY.GDP.MKTP.CD': 'gdp_usd',
    'SP.POP.TOTL': 'population_total'
}

def fetch_and_ingest():
    for code, internal_name in INDICATORS.items():
        print(f"Fetching {internal_name}...")
        response = requests.get(f"{WB_API_URL}{code}?date=2000:2024&format=json")
        
        if response.status_code == 200:
            data = response.json()
            if len(data) > 1:
                # Transform data to internal format
                records = []
                for entry in data[1]:
                    if entry['value'] is not None:
                        records.append({
                            "indicator": internal_name,
                            "value": float(entry['value']),
                            "date": f"{entry['date']}-01-01",
                            "source": "World Bank"
                        })
                
                # Push to Yemen Core
                payload = {
                    "source_name": "World Bank API",
                    "data": records
                }
                # requests.post(API_BASE_URL, json=payload) 
                print(f"Prepared {len(records)} records for ingestion.")
        else:
            print(f"Failed to fetch {code}")

if __name__ == "__main__":
    fetch_and_ingest()
