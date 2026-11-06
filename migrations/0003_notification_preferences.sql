ALTER TABLE workspace_settings
  ADD COLUMN notifications_enabled INTEGER NOT NULL DEFAULT 1
  CHECK (notifications_enabled IN (0, 1));
