<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6a4aeec5-a8d1-449a-9df2-9c9376095b7f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Asset library (Supabase + gpt-image-2)

The **Asset library** sidebar page stores product images and generates platform-specific variants (Tmall, JD, Temu, Instagram).

1. Create a [Supabase](https://supabase.com) project.
2. Run SQL from [`supabase/migrations/001_asset_library.sql`](supabase/migrations/001_asset_library.sql) in the Supabase SQL Editor.
3. Create a **public** Storage bucket named `product-media` (Dashboard → Storage → New bucket).
4. Add to `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (gpt-image-2 requires [Organization Verification](https://platform.openai.com/settings/organization/general))
5. Mirror the same env vars on Vercel for production.

## Knowledge base / RAG (Phase 1)

The **Knowledge base** page stores brand guides, product copy, and historical posts as vector embeddings for content generation.

1. Run SQL from [`supabase/migrations/002_knowledge_rag.sql`](supabase/migrations/002_knowledge_rag.sql) (enables `pgvector`, creates `knowledge_documents` / `knowledge_chunks`, and `match_knowledge_chunks` RPC).
2. Ensure `OPENAI_API_KEY` is set (uses `text-embedding-3-small` by default).
3. Ingest documents via the **Knowledge base** sidebar page.
4. Content generation (`/api/content/ideas`, `/api/content/generate`, Agent tools) automatically injects RAG context when configured.

Optional: pass `persistToKnowledge: true` in content API bodies to save generated ideas back into the knowledge base as `history_copy`.
