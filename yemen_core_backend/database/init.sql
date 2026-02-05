-- Yemen Core: Sovereign Data Warehouse Schema v1.1
-- Database: PostgreSQL 16+
-- Extensions: pgvector

-- Enable the vector extension for semantic search capabilities
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing table to recreate it with the new dynamic control schema
DROP TABLE IF EXISTS data_sources CASCADE;

-- Table to log and manage all data sources with dynamic controls
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url TEXT,
    source_type VARCHAR(50) CHECK (source_type IN ('government_website', 'ngo_report', 'leaked_documents', 'manual_upload', 'api_feed')),
    is_active BOOLEAN DEFAULT true,
    auth_type VARCHAR(20) CHECK (auth_type IN ('no_auth', 'api_key', 'bearer_token')) DEFAULT 'no_auth',
    credentials TEXT, -- This will store encrypted credentials
    fetch_frequency VARCHAR(50) DEFAULT 'daily', -- e.g., 'daily', 'weekly', 'monthly', 'hourly'
    last_status VARCHAR(100) DEFAULT 'pending', -- e.g., 'success', 'error: 404', 'pending'
    last_run_log TEXT,
    last_crawled_at TIMESTAMP WITH TIME ZONE
);

-- Table for statistical time-series data
CREATE TABLE IF NOT EXISTS yemen_stats (
    id BIGSERIAL PRIMARY KEY,
    indicator VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    unit VARCHAR(50),
    record_date DATE NOT NULL,
    source_id INTEGER REFERENCES data_sources(id),
    geographical_area VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_yemen_stats_indicator_date ON yemen_stats(indicator, record_date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_stat ON yemen_stats(indicator, record_date, geographical_area); -- Prevent duplicate entries

-- Table for documents, reports, and unstructured text
CREATE TABLE IF NOT EXISTS yemen_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_url TEXT,
    source_id INTEGER REFERENCES data_sources(id),
    publish_date DATE,
    classification VARCHAR(100) DEFAULT 'unclassified',
    full_content TEXT,
    metadata JSONB,
    embedding VECTOR(768), -- For BGE-base model. Use 1024 for BGE-large/m3.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_yemen_docs_embedding ON yemen_docs USING HNSW (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_yemen_docs_metadata ON yemen_docs USING GIN (metadata);

-- NEW: Table for Yemen geographical data
CREATE TABLE IF NOT EXISTS yemen_geography (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_level VARCHAR(50), -- 'governorate', 'district'
    geoname_id INTEGER UNIQUE,
    latitude FLOAT,
    longitude FLOAT,
    population BIGINT,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_yemen_geography_name ON yemen_geography(name);


-- Pre-populate data sources with new schema
INSERT INTO data_sources (name, url, source_type, is_active, auth_type, fetch_frequency) VALUES
('WorldBank', 'https://api.worldbank.org/v2/country/yem/indicator/', 'api_feed', true, 'no_auth', 'monthly'),
('Open-Meteo', 'https://api.open-meteo.com/v1/forecast', 'api_feed', true, 'no_auth', 'daily'),
('NASA FIRMS', 'https://firms.modaps.eosdis.nasa.gov/api/country/', 'api_feed', false, 'api_key', 'daily'),
('REST Countries', 'https://restcountries.com/v3.1/alpha/ye', 'api_feed', true, 'no_auth', 'yearly'),
('GeoNames', 'http://api.geonames.org/', 'api_feed', false, 'api_key', 'yearly'),
('WHO GHO', 'http://apps.who.int/gho/athena/api/', 'api_feed', false, 'no_auth', 'monthly'),
('Measurement Lab', 'https://stat.ripe.net/data/mlab-bandwidth/', 'api_feed', false, 'no_auth', 'weekly'),
('Manual Uploads', NULL, 'manual_upload', true, 'no_auth', NULL)
ON CONFLICT (name) DO NOTHING;
