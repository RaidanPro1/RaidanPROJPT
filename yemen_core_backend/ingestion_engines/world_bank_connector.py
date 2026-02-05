import asyncpg
import os
import requests
import asyncio
from datetime import datetime

# --- Configuration ---
# This script is designed to be run as a cron job.
# It connects to the DB to get its configuration dynamically.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://yemen_core_user:sovereign_password@localhost:5433/yemen_core_db")
SOURCE_NAME = 'WorldBank'

INDICATORS = {
    'NY.GDP.MKTP.CD': 'gdp_usd',
    'SP.POP.TOTL': 'population_total',
    'SI.POV.DDAY': 'poverty_headcount_ratio'
}

async def run_ingestion():
    """
    Connects to the World Bank API to fetch economic indicators for Yemen.
    This function reads its configuration (e.g., is_active) from the 
    'data_sources' table before execution.
    """
    conn = None
    log_messages = []
    
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # 1. Fetch dynamic configuration from the database
        source_config = await conn.fetchrow("SELECT * FROM data_sources WHERE name = $1", SOURCE_NAME)

        if not source_config:
            print(f"Error: Source '{SOURCE_NAME}' not found in the database.")
            return

        if not source_config['is_active']:
            print(f"Source '{SOURCE_NAME}' is disabled. Skipping ingestion.")
            await conn.execute(
                "UPDATE data_sources SET last_status = 'skipped (disabled)', last_crawled_at = NOW() WHERE name = $1",
                SOURCE_NAME
            )
            return

        print(f"Starting {SOURCE_NAME} ingestion...")
        log_messages.append(f"Ingestion started for {len(INDICATORS)} indicators.")
        
        base_url = source_config['url']
        current_year = datetime.now().year
        # Fetch data for the last 20 years
        date_range = f"{current_year - 20}:{current_year}"
        
        total_ingested = 0
        
        # NOTE: A more robust version would use aiohttp for async requests.
        # Using `requests` here for simplicity as requested.
        for code, indicator_name in INDICATORS.items():
            api_url = f"{base_url}{code}?date={date_range}&format=json"
            response = requests.get(api_url, timeout=30)
            
            if response.status_code != 200 or not response.json() or not response.json()[1]:
                log_messages.append(f"Warning: No data received for indicator '{indicator_name}' ({code}).")
                continue

            data_points = response.json()[1]
            ingested_for_indicator = 0
            for point in data_points:
                if point['value'] is not None:
                    # Insert data into yemen_stats table
                    # ON CONFLICT ensures we don't insert duplicate data
                    await conn.execute(
                        """
                        INSERT INTO yemen_stats (indicator, value, unit, record_date, source_id, geographical_area)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (indicator, record_date, geographical_area) DO NOTHING;
                        """,
                        indicator_name,
                        float(point['value']),
                        'USD' if 'gdp' in indicator_name else None,
                        datetime(int(point['date']), 1, 1).date(),
                        source_config['id'],
                        'National'
                    )
                    ingested_for_indicator += 1
            
            total_ingested += ingested_for_indicator
            log_messages.append(f"Ingested {ingested_for_indicator} points for {indicator_name}.")
        
        final_log = f"Success. Total points ingested: {total_ingested}. " + " | ".join(log_messages)
        await conn.execute(
            "UPDATE data_sources SET last_status = 'success', last_run_log = $1, last_crawled_at = NOW() WHERE name = $2",
            final_log[:1000], # Truncate log to fit in DB
            SOURCE_NAME
        )
        print("World Bank ingestion completed successfully.")

    except Exception as e:
        error_message = f"Error during {SOURCE_NAME} ingestion: {str(e)}"
        print(error_message)
        if conn:
            await conn.execute(
                "UPDATE data_sources SET last_status = 'error', last_run_log = $1, last_crawled_at = NOW() WHERE name = $2",
                error_message,
                SOURCE_NAME
            )
    finally:
        if conn:
            await conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    # This allows running the script directly for testing or via a cron job
    # e.g., 0 2 1 * * /usr/bin/python3 /path/to/world_bank_connector.py
    print("Running Yemen Core Ingestion Engine: World Bank")
    asyncio.run(run_ingestion())
