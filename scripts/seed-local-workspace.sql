-- This seed is only used by the local development database.
-- It is never applied by the remote migration command.
INSERT OR IGNORE INTO workspaces (id, name, timezone)
VALUES ('workspace_local', 'SocMed Manager Local', 'Asia/Jakarta');

INSERT OR IGNORE INTO workspace_members
  (id, workspace_id, email, display_name, role, status)
VALUES
  ('member_local_owner', 'workspace_local', 'owner@local.test', 'Local Owner', 'OWNER', 'ACTIVE');

INSERT OR IGNORE INTO workspace_members
  (id, workspace_id, email, display_name, role, status)
VALUES
  ('member_local_editor', 'workspace_local', 'editor@local.test', 'Local Editor', 'EDITOR', 'ACTIVE');
