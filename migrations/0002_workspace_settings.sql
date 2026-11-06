CREATE TABLE IF NOT EXISTS workspace_settings (
  workspace_id TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'Bahasa Indonesia',
  data_retention TEXT NOT NULL DEFAULT '12 bulan',
  background_ai_provider TEXT NOT NULL DEFAULT 'Gemini adapter',
  reduced_motion INTEGER NOT NULL DEFAULT 0 CHECK (reduced_motion IN (0, 1)),
  focus_visible INTEGER NOT NULL DEFAULT 1 CHECK (focus_visible IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
