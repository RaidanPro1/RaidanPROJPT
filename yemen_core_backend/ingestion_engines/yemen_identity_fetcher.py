import asyncpg
import os
import requests
import asyncio
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://yemen_core_user:sovereign_password@localhost:5433/yemen_core_db")

async def fetch_geonames(conn, geonames_username):
    """Fetches governorates and districts from GeoNames API."""
    if not geonames_username:
        print("Warning: GEONAMES_USERNAME not set. Skipping geography fetch.")
        return 0

    # Fetch Governorates (admin level 1)
    url_gov = f"http://api.geonames.org/searchJSON?country=YE&featureCode=ADM1&username={geonames_username}"
    response_gov = requests.get(url_gov, timeout=30)
    governorates = response_gov.json().get('geonames', [])
    
    ingested_count = 0
    for gov in governorates:
        await conn.execute(
            """
            INSERT INTO yemen_geography (name, admin_level, geoname_id, latitude, longitude, population)
            VALUES ($1, 'governorate', $2, $3, $4, $5)
            ON CONFLICT (geoname_id) DO NOTHING;
            """,
            gov.get('name'),
            gov.get('geonameId'),
            float(gov.get('lat')),
            float(gov.get('lng')),
            int(gov.get('population', 0))
        )
        ingested_count += 1
    
    print(f"Fetched and stored {ingested_count} governorates.")
    return ingested_count

async def run_ingestion():
    """
    Fetches basic identity and geographical data for Yemen.
    """
    conn = None
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Check if GeoNames source is configured and get username (credentials)
        source_config = await conn.fetchrow("SELECT * FROM data_sources WHERE name = 'GeoNames'")
        
        if not source_config or not source_config['is_active']:
            print("GeoNames source is disabled or not configured. Skipping.")
            return

        # In a real app, you would decrypt the credentials here.
        # For now, we assume it's stored plainly for this demo script.
        geonames_username = source_config['credentials']
        
        count = await fetch_geonames(conn, geonames_username)
        
        await conn.execute(
            "UPDATE data_sources SET last_status = 'success', last_run_log = $1, last_crawled_at = NOW() WHERE name = 'GeoNames'",
            f"Successfully ingested {count} geographical records."
        )

    except Exception as e:
        error_message = f"Error during Yemen Identity ingestion: {str(e)}"
        print(error_message)
        if conn:
             await conn.execute(
                "UPDATE data_sources SET last_status = 'error', last_run_log = $1, last_crawled_at = NOW() WHERE name = 'GeoNames'",
                error_message
            )
    finally:
        if conn:
            await conn.close()

if __name__ == "__main__":
    print("Running Yemen Core Ingestion Engine: Identity Fetcher")
    # You would need to add the GeoNames username to the DB first via the UI
    # For now, you can manually insert it for testing:
    # UPDATE data_sources SET credentials = 'your_username' WHERE name = 'GeoNames';
    asyncio.run(run_ingestion())
