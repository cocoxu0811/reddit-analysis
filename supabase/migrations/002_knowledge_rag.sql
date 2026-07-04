-- Phase 1: RAG knowledge retrieval layer (pgvector on Supabase Postgres)
-- Run after 001_asset_library.sql in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (
    source_type IN (
      'brand_guide',
      'product_desc',
      'history_copy',
      'subreddit_rules',
      'campaign_strategy'
    )
  ),
  tags TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'zh')),
  performance_weight REAL NOT NULL DEFAULT 0.5 CHECK (performance_weight >= 0 AND performance_weight <= 1),
  chunk_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_created ON knowledge_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_source ON knowledge_documents(source_type);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  source_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en',
  performance_weight REAL NOT NULL DEFAULT 0.5,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document ON knowledge_chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source ON knowledge_chunks(source_type);

-- HNSW index for cosine similarity (Supabase pgvector)
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON knowledge_chunks USING hnsw (embedding vector_cosine_ops);

CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  filter_source_type TEXT DEFAULT NULL,
  filter_language TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  tags TEXT[],
  performance_weight REAL,
  similarity REAL,
  combined_score REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.document_id,
    kc.title,
    kc.content,
    kc.source_type,
    kc.tags,
    kc.performance_weight,
    (1 - (kc.embedding <=> query_embedding))::REAL AS similarity,
    ((1 - (kc.embedding <=> query_embedding)) * 0.6 + kc.performance_weight * 0.4)::REAL AS combined_score
  FROM knowledge_chunks kc
  WHERE kc.embedding IS NOT NULL
    AND (filter_source_type IS NULL OR kc.source_type = filter_source_type)
    AND (filter_language IS NULL OR kc.language = filter_language)
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;
