# Guide d'installation rapide - Workflow Philippineasy

## Installation en 10 minutes

### Étape 1: Préparer Supabase (3 min)

1. **Créer la table articles**:

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug VARCHAR(75) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  content_preview TEXT,
  category_id INTEGER,
  image TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  author_id UUID,
  reading_time INTEGER,
  source VARCHAR(50) DEFAULT 'n8n',
  source_url TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_source_url ON articles(source_url);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
```

2. **Créer la table d'erreurs**:

```sql
CREATE TABLE workflow_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  workflow TEXT,
  execution_id TEXT,
  node TEXT,
  error TEXT,
  stack TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_errors_timestamp ON workflow_errors(timestamp DESC);
```

3. **Obtenir la Service Role Key**:
   - Settings > API > Project API keys
   - Copier la "service_role" key (pas la anon key!)

---

### Étape 2: Configurer les credentials n8n (5 min)

1. **Anthropic (Claude)**:
   - Aller sur https://console.anthropic.com
   - Créer une API key
   - Dans n8n: Settings > Credentials > New > Anthropic
   - Coller la clé

2. **OpenAI (DALL-E)**:
   - Aller sur https://platform.openai.com/api-keys
   - Créer une API key
   - Dans n8n: Settings > Credentials > New > OpenAI
   - Coller la clé

3. **FireCrawl**:
   - Aller sur https://firecrawl.dev
   - Créer un compte et obtenir une API key
   - Dans n8n: Settings > Credentials > New > HTTP Header Auth
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_FIRECRAWL_KEY`

4. **Supabase**:
   - Dans n8n: Settings > Credentials > New > Supabase
   - Host: `https://YOUR_PROJECT.supabase.co`
   - Service Role Key: (celle obtenue à l'étape 1)

---

### Étape 3: Importer le workflow (2 min)

1. Dans n8n, cliquer sur "Workflows"
2. Cliquer sur "Import from File"
3. Sélectionner `philippineasy-article-automation.json`
4. Cliquer sur "Import"

---

### Étape 4: Configurer les credentials dans le workflow

Ouvrir chaque node suivant et sélectionner la bonne credential:

- **FireCrawl Scrape**: Sélectionner votre credential FireCrawl
- **Claude AI Processing**: Sélectionner votre credential Anthropic
- **DALL-E Generate Image**: Sélectionner votre credential OpenAI
- **Check Duplicate in Supabase**: Sélectionner votre credential Supabase
- **Insert to Supabase**: Sélectionner votre credential Supabase
- **Save Error to DB**: Sélectionner votre credential Supabase

---

### Étape 5: Test

1. Cliquer sur "Execute Workflow"
2. Attendre l'exécution (peut prendre 2-3 minutes)
3. Vérifier dans Supabase que l'article a été créé:

```sql
SELECT title, slug, status, created_at
FROM articles
ORDER BY created_at DESC
LIMIT 1;
```

4. Si erreur, consulter le node "Log Error"

---

### Étape 6: Activation

1. Cliquer sur le toggle "Active" en haut à gauche
2. Le workflow s'exécutera automatiquement tous les jours à 8h

---

## Checklist finale

- [ ] Tables Supabase créées
- [ ] Service Role Key Supabase obtenue
- [ ] Clé API Anthropic créée
- [ ] Clé API OpenAI créée
- [ ] Clé API FireCrawl créée
- [ ] Credentials configurées dans n8n
- [ ] Workflow importé
- [ ] Credentials assignées aux nodes
- [ ] Test manuel réussi
- [ ] Article visible dans Supabase
- [ ] Workflow activé

---

## Premiers articles

Après activation, le workflow va:

1. **8h le lendemain**: Première exécution automatique
2. **Scraper**: Les 3 sources (2 RSS + 1 FireCrawl)
3. **Filtrer**: Articles des 7 derniers jours
4. **Vérifier**: Pas de doublons
5. **Générer**: 1 article avec Claude + DALL-E
6. **Insérer**: Dans Supabase avec status "draft"

**Important**: Les articles sont créés en "draft", vous devez les publier manuellement.

---

## Monitoring simple

**Vérifier les articles créés**:
```sql
SELECT COUNT(*) as total_articles,
       COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days
FROM articles
WHERE source = 'n8n';
```

**Vérifier les erreurs**:
```sql
SELECT * FROM workflow_errors
ORDER BY timestamp DESC
LIMIT 5;
```

**Voir le dernier article**:
```sql
SELECT title, slug, reading_time, created_at
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 1;
```

---

## Dépannage rapide

### Workflow ne se déclenche pas
- Vérifier que le workflow est "Active"
- Vérifier l'heure actuelle vs le schedule (8h UTC?)

### Pas d'articles créés
- Tester manuellement avec "Execute Workflow"
- Vérifier les logs de chaque node
- Vérifier que les sources RSS sont accessibles

### Erreur Supabase
- Vérifier la Service Role Key (pas anon key)
- Vérifier que les tables existent
- Vérifier les permissions Supabase

### Erreur OpenAI/Anthropic
- Vérifier les clés API
- Vérifier les crédits/quotas
- Vérifier que vous avez accès aux modèles

---

## Coûts estimés

**Par article**: ~$0.12
**Par mois (1/jour)**: ~$3.60

Créditez vos comptes API:
- Anthropic: $10 minimum (suffisant pour ~300 articles)
- OpenAI: $10 minimum (suffisant pour ~125 images)
- FireCrawl: Plan gratuit ou $10/mois

---

## Support

En cas de problème:
1. Consulter `WORKFLOW-DOCUMENTATION.md` (guide complet)
2. Vérifier la table `workflow_errors`
3. Tester les credentials un par un
4. Consulter https://docs.n8n.io

---

**Installation complète**: 10-15 minutes
**Premier article**: Lendemain à 8h ou test immédiat
**Status**: Production Ready ✅
