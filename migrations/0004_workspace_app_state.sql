CREATE TABLE IF NOT EXISTS workspace_app_state (
  workspace_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  state_json TEXT NOT NULL CHECK (json_valid(state_json)),
  updated_by_member_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by_member_id) REFERENCES workspace_members(id) ON DELETE SET NULL
);
