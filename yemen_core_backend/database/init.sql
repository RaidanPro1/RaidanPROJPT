
-- Yemen Core: Sovereign Data Warehouse Schema v1.0
-- Database: PostgreSQL 16+
-- Extensions: pgvector

-- Enable the vector extension for semantic search capabilities
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to log and manage all data sources
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    url TEXT,
    source_type VARCHAR(50) CHECK (source_type IN ('government_website', 'ngo_report', 'leaked_documents', 'manual_upload', 'api_feed')),
    is_active BOOLEAN DEFAULT true,
    fetch_frequency VARCHAR(50) DEFAULT 'daily', -- e.g., 'daily', 'weekly', 'monthly'
    last_crawled_at TIMESTAMP WITH TIME ZONE
);

-- Table for statistical time-series data (Structured Data)
-- Designed to hold everything from Population to Exchange Rates
CREATE TABLE IF NOT EXISTS yemen_stats (
    id BIGSERIAL PRIMARY KEY,
    indicator VARCHAR(255) NOT NULL, -- e.g., "population_total", "exchange_rate_usd_sana"
    value FLOAT NOT NULL,
    unit VARCHAR(50), -- e.g., "capita", "YER"
    record_date DATE NOT NULL,
    source_id INTEGER REFERENCES data_sources(id),
    geographical_area VARCHAR(255), -- Normalized area name: "Sana'a", "Aden", "National"
    metadata JSONB, -- Flexible field for extra context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast time-series retrieval
CREATE INDEX IF NOT EXISTS idx_yemen_stats_indicator_date ON yemen_stats(indicator, record_date DESC);

-- Table for documents, reports, and unstructured text
-- Contains embeddings for Semantic Search
CREATE TABLE IF NOT EXISTS yemen_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_url TEXT,
    source_id INTEGER REFERENCES data_sources(id),
    publish_date DATE,
    classification VARCHAR(100) DEFAULT 'unclassified', -- e.g., 'public', 'confidential'
    full_content TEXT, -- The raw text extracted via OCR/PDF parsing
    metadata JSONB, -- Authors, keywords, original filename
    embedding VECTOR(768), -- For BGE-base model. Use 1024 for BGE-large/m3.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_yemen_docs_embedding ON yemen_docs USING HNSW (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_yemen_docs_metadata ON yemen_docs USING GIN (metadata);

-- Pre-populate some known data sources
INSERT INTO data_sources (name, url, source_type, fetch_frequency) VALUES
('Central Bank of Yemen (Aden)', 'https://cby-ye.com', 'government_website', 'daily'),
('World Bank Data API', 'https://api.worldbank.org/v2/country/yem', 'api_feed', 'monthly'),
('OCHA Yemen Reports', 'https://reports.unocha.org/en/country/yemen', 'ngo_report', 'weekly'),
('Manual Uploads', NULL, 'manual_upload', NULL)
ON CONFLICT (name) DO NOTHING;
