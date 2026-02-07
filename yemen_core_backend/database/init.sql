
-- Yemen Core: Sovereign Data Warehouse Schema v1.2
-- Database: PostgreSQL 16+
-- Extensions: pgvector

CREATE EXTENSION IF NOT EXISTS vector;

-- Table to log and manage all data sources
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url TEXT,
    source_type VARCHAR(50) CHECK (source_type IN ('government_website', 'ngo_report', 'leaked_documents', 'manual_upload', 'api_feed', 'real_time', 'news_site', 'social_media')),
    is_active BOOLEAN DEFAULT true,
    fetch_frequency VARCHAR(50) DEFAULT 'daily', 
    credentials TEXT, 
    last_crawled_at TIMESTAMP WITH TIME ZONE
);

-- Sentiment Tracking (Strategic Anger/Hate Index)
CREATE TABLE IF NOT EXISTS yemen_sentiment_logs (
    id BIGSERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES data_sources(id),
    category VARCHAR(50), -- 'anger', 'hate_speech', 'propaganda', 'unity'
    intensity FLOAT, -- 0.0 to 1.0
    keywords_found TEXT[],
    geotag VARCHAR(100),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OSINT Shadow Analysis (Time/Height Estimation)
CREATE TABLE IF NOT EXISTS yemen_osint_shadows (
    id BIGSERIAL PRIMARY KEY,
    location_name TEXT,
    object_height_est FLOAT,
    shadow_length_obs FLOAT,
    calculated_timestamp TIMESTAMP WITH TIME ZONE,
    confidence_score FLOAT,
    image_reference UUID,
    metadata JSONB
);

-- Table for statistical time-series data
CREATE TABLE IF NOT EXISTS yemen_stats (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    indicator VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    unit VARCHAR(50), 
    record_date TIMESTAMP WITH TIME ZONE NOT NULL,
    source_id INTEGER REFERENCES data_sources(id),
    geographical_area VARCHAR(255), 
    metadata JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sentiment_time ON yemen_sentiment_logs(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_shadow_loc ON yemen_osint_shadows(location_name);
