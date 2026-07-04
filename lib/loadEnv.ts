/**
 * Load .env then .env.local (local overrides). Matches Vite/Cursor convention.
 * Must be imported before any module reads process.env.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
