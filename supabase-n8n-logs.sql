-- Table pour les logs des workflows n8n
-- A executer dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS n8n_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  workflow TEXT NOT NULL,
  execution_id TEXT,
  node TEXT,
  error_message TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_n8n_logs_timestamp ON n8n_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_severity ON n8n_logs(severity);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_workflow ON n8n_logs(workflow);

-- Commentaires
COMMENT ON TABLE n8n_logs IS 'Logs des executions de workflows n8n';
COMMENT ON COLUMN n8n_logs.workflow IS 'Nom du workflow';
COMMENT ON COLUMN n8n_logs.execution_id IS 'ID unique de l execution n8n';
COMMENT ON COLUMN n8n_logs.node IS 'Node qui a genere l erreur';
COMMENT ON COLUMN n8n_logs.error_message IS 'Message d erreur';
COMMENT ON COLUMN n8n_logs.severity IS 'Niveau de severite: info, warning, error, critical';

-- RLS (Row Level Security) - optionnel
-- ALTER TABLE n8n_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow service role full access" ON n8n_logs FOR ALL USING (true);

-- Verification
SELECT 'Table n8n_logs creee avec succes!' as message;
