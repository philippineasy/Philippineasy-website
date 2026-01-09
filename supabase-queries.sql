-- ============================================================================
-- PHILIPPINEASY - SUPABASE QUERIES
-- Requêtes SQL utiles pour la gestion des articles automatisés
-- ============================================================================

-- ============================================================================
-- 1. CRÉATION DES TABLES
-- ============================================================================

-- Table principale des articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug VARCHAR(75) UNIQUE NOT NULL,
  content JSONB NOT NULL,                    -- Format EditorJS
  content_preview TEXT,                       -- Meta description
  category_id INTEGER,
  image TEXT,                                 -- URL de l'image
  status VARCHAR(20) DEFAULT 'draft',        -- 'draft' ou 'published'
  author_id UUID,                             -- Nullable pour articles n8n
  reading_time INTEGER,                       -- En minutes
  source VARCHAR(50) DEFAULT 'n8n',          -- Source de l'article
  source_url TEXT UNIQUE,                     -- URL originale (pour déduplication)
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table pour les erreurs du workflow
CREATE TABLE IF NOT EXISTS workflow_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  workflow TEXT,
  execution_id TEXT,
  node TEXT,
  error TEXT,
  stack TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les erreurs
CREATE INDEX IF NOT EXISTS idx_workflow_errors_timestamp ON workflow_errors(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_errors_workflow ON workflow_errors(workflow);

-- ============================================================================
-- 2. REQUÊTES DE MONITORING
-- ============================================================================

-- Voir les derniers articles créés par n8n
SELECT
  title,
  slug,
  status,
  reading_time,
  created_at,
  source_url
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 10;

-- Statistiques globales
SELECT
  COUNT(*) as total_articles,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM articles
WHERE source = 'n8n';

-- Articles par jour (derniers 30 jours)
SELECT
  DATE(created_at) as date,
  COUNT(*) as articles_created
FROM articles
WHERE source = 'n8n'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Temps de lecture moyen
SELECT
  AVG(reading_time) as avg_reading_time,
  MIN(reading_time) as min_reading_time,
  MAX(reading_time) as max_reading_time
FROM articles
WHERE source = 'n8n';

-- Voir les erreurs récentes du workflow
SELECT
  timestamp,
  workflow,
  node,
  error,
  execution_id
FROM workflow_errors
ORDER BY timestamp DESC
LIMIT 20;

-- Statistiques d'erreurs
SELECT
  node,
  COUNT(*) as error_count,
  MAX(timestamp) as last_error
FROM workflow_errors
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY node
ORDER BY error_count DESC;

-- ============================================================================
-- 3. GESTION DES ARTICLES
-- ============================================================================

-- Publier un article draft
UPDATE articles
SET
  status = 'published',
  published_at = NOW()
WHERE slug = 'votre-slug-ici'
  AND status = 'draft';

-- Publier tous les drafts de plus de 3 jours (auto-publish)
UPDATE articles
SET
  status = 'published',
  published_at = NOW()
WHERE status = 'draft'
  AND source = 'n8n'
  AND created_at < NOW() - INTERVAL '3 days';

-- Repasser un article en draft
UPDATE articles
SET status = 'draft'
WHERE slug = 'votre-slug-ici';

-- Supprimer un article
DELETE FROM articles
WHERE slug = 'votre-slug-ici';

-- Voir le contenu EditorJS d'un article
SELECT
  title,
  slug,
  content,
  content_preview
FROM articles
WHERE slug = 'votre-slug-ici';

-- ============================================================================
-- 4. VALIDATION ET NETTOYAGE
-- ============================================================================

-- Trouver les articles sans image
SELECT title, slug, created_at
FROM articles
WHERE image IS NULL OR image = ''
ORDER BY created_at DESC;

-- Trouver les slugs trop longs (>75 chars)
SELECT title, slug, LENGTH(slug) as slug_length
FROM articles
WHERE LENGTH(slug) > 75;

-- Trouver les meta descriptions invalides (<150 ou >160 chars)
SELECT
  title,
  slug,
  LENGTH(content_preview) as description_length,
  content_preview
FROM articles
WHERE LENGTH(content_preview) < 150
   OR LENGTH(content_preview) > 160;

-- Trouver les doublons potentiels (même source_url)
SELECT source_url, COUNT(*) as count
FROM articles
GROUP BY source_url
HAVING COUNT(*) > 1;

-- Valider la structure EditorJS (doit contenir 'blocks' et 'version')
SELECT
  title,
  slug,
  content ? 'blocks' as has_blocks,
  content ? 'version' as has_version,
  content->>'version' as editorjs_version
FROM articles
WHERE source = 'n8n'
  AND (
    NOT (content ? 'blocks')
    OR NOT (content ? 'version')
  );

-- ============================================================================
-- 5. ANALYSE DE CONTENU
-- ============================================================================

-- Compter les blocks par type dans un article
SELECT
  title,
  slug,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(content->'blocks') AS block
    WHERE block->>'type' = 'paragraph'
  ) as paragraphs,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(content->'blocks') AS block
    WHERE block->>'type' = 'header' AND block->'data'->>'level' = '2'
  ) as h2_headers,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(content->'blocks') AS block
    WHERE block->>'type' = 'list'
  ) as lists,
  (
    SELECT COUNT(*)
    FROM jsonb_array_elements(content->'blocks') AS block
    WHERE block->>'type' = 'table'
  ) as tables
FROM articles
WHERE slug = 'votre-slug-ici';

-- Statistiques globales de structure de contenu
SELECT
  AVG(paragraph_count) as avg_paragraphs,
  AVG(header_count) as avg_headers,
  AVG(list_count) as avg_lists,
  AVG(table_count) as avg_tables
FROM (
  SELECT
    (
      SELECT COUNT(*)
      FROM jsonb_array_elements(content->'blocks') AS block
      WHERE block->>'type' = 'paragraph'
    ) as paragraph_count,
    (
      SELECT COUNT(*)
      FROM jsonb_array_elements(content->'blocks') AS block
      WHERE block->>'type' = 'header'
    ) as header_count,
    (
      SELECT COUNT(*)
      FROM jsonb_array_elements(content->'blocks') AS block
      WHERE block->>'type' = 'list'
    ) as list_count,
    (
      SELECT COUNT(*)
      FROM jsonb_array_elements(content->'blocks') AS block
      WHERE block->>'type' = 'table'
    ) as table_count
  FROM articles
  WHERE source = 'n8n'
) AS stats;

-- ============================================================================
-- 6. RECHERCHE ET FILTRAGE
-- ============================================================================

-- Rechercher dans les titres
SELECT title, slug, created_at
FROM articles
WHERE title ILIKE '%philippines%'
ORDER BY created_at DESC;

-- Rechercher dans le contenu (texte des paragraphes)
SELECT
  title,
  slug
FROM articles,
  jsonb_array_elements(content->'blocks') AS block
WHERE block->>'type' = 'paragraph'
  AND block->'data'->>'text' ILIKE '%boracay%';

-- Articles par catégorie
SELECT
  category_id,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'published' THEN 1 END) as published
FROM articles
WHERE source = 'n8n'
GROUP BY category_id
ORDER BY count DESC;

-- Articles les plus longs (en temps de lecture)
SELECT
  title,
  slug,
  reading_time,
  created_at
FROM articles
WHERE source = 'n8n'
ORDER BY reading_time DESC
LIMIT 10;

-- ============================================================================
-- 7. MAINTENANCE
-- ============================================================================

-- Nettoyer les anciennes erreurs (>30 jours)
DELETE FROM workflow_errors
WHERE timestamp < NOW() - INTERVAL '30 days';

-- Nettoyer les articles draft très anciens (>90 jours)
DELETE FROM articles
WHERE status = 'draft'
  AND source = 'n8n'
  AND created_at < NOW() - INTERVAL '90 days';

-- Mettre à jour le reading_time pour tous les articles
-- (À exécuter si la formule de calcul change)
UPDATE articles
SET reading_time = (
  SELECT CEIL(
    (
      SELECT SUM(
        CASE
          WHEN block->>'type' IN ('paragraph', 'header')
          THEN array_length(regexp_split_to_array(block->'data'->>'text', '\s+'), 1)
          WHEN block->>'type' = 'list'
          THEN array_length(regexp_split_to_array(
            array_to_string(
              ARRAY(SELECT jsonb_array_elements_text(block->'data'->'items')),
              ' '
            ),
            '\s+'
          ), 1)
          ELSE 0
        END
      )
      FROM jsonb_array_elements(content->'blocks') AS block
    ) / 200.0
  )
)
WHERE source = 'n8n';

-- Reconstruire les index (si performance dégradée)
REINDEX TABLE articles;
REINDEX TABLE workflow_errors;

-- Analyser les tables pour optimiser les requêtes
ANALYZE articles;
ANALYZE workflow_errors;

-- ============================================================================
-- 8. BACKUP ET EXPORT
-- ============================================================================

-- Exporter tous les articles n8n en JSON
SELECT
  jsonb_build_object(
    'title', title,
    'slug', slug,
    'content', content,
    'meta', jsonb_build_object(
      'category_id', category_id,
      'status', status,
      'reading_time', reading_time,
      'created_at', created_at,
      'source_url', source_url
    )
  )
FROM articles
WHERE source = 'n8n';

-- Compter le nombre total d'articles pour vérification après backup
SELECT
  source,
  status,
  COUNT(*) as count
FROM articles
GROUP BY ROLLUP(source, status)
ORDER BY source, status;

-- ============================================================================
-- 9. SÉCURITÉ ET PERMISSIONS
-- ============================================================================

-- Créer un role read-only pour consultation
-- (À exécuter avec les droits superuser)
/*
CREATE ROLE n8n_readonly;
GRANT SELECT ON articles TO n8n_readonly;
GRANT SELECT ON workflow_errors TO n8n_readonly;
*/

-- Row Level Security (RLS) - exemple pour limiter l'accès
-- (Optionnel, à adapter selon vos besoins)
/*
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role can do everything"
  ON articles
  USING (auth.role() = 'service_role');
*/

-- ============================================================================
-- 10. REQUÊTES UTILES POUR DEBUG
-- ============================================================================

-- Voir la structure complète d'un article
SELECT
  id,
  title,
  slug,
  jsonb_pretty(content) as content_formatted,
  content_preview,
  category_id,
  image,
  status,
  reading_time,
  source,
  source_url,
  published_at,
  created_at,
  updated_at
FROM articles
WHERE slug = 'votre-slug-ici';

-- Valider qu'il n'y a pas de source_url NULL
SELECT COUNT(*) as articles_sans_source_url
FROM articles
WHERE source = 'n8n'
  AND source_url IS NULL;

-- Trouver les articles créés aujourd'hui
SELECT title, slug, created_at
FROM articles
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Dernière exécution du workflow (basée sur les articles)
SELECT MAX(created_at) as last_execution
FROM articles
WHERE source = 'n8n';

-- ============================================================================
-- NOTES
-- ============================================================================

/*
1. Remplacer 'votre-slug-ici' par le slug réel de l'article
2. Les intervalles peuvent être ajustés (INTERVAL '7 days', etc.)
3. Pour les requêtes sur le JSONB, assurez-vous d'avoir les index GIN si performance faible
4. Toujours tester les UPDATE/DELETE sur un petit échantillon d'abord
5. Faire des backups réguliers avant opérations de maintenance
6. Utiliser EXPLAIN ANALYZE pour optimiser les requêtes lentes
*/

-- Exemple d'index GIN pour recherche full-text dans le contenu
-- CREATE INDEX idx_articles_content_gin ON articles USING gin(content);

-- ============================================================================
-- FIN
-- ============================================================================
