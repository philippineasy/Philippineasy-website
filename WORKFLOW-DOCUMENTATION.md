# Workflow n8n - Philippineasy Article Automation

## Vue d'ensemble

Workflow professionnel pour automatiser la création d'articles sur Philippineasy.com en utilisant:
- Scraping multi-sources (RSS + FireCrawl)
- Intelligence artificielle (Claude 3.5 Sonnet)
- Génération d'images (DALL-E 3)
- Base de données Supabase

## Architecture du workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRIGGER & SOURCES                            │
├─────────────────────────────────────────────────────────────────┤
│ Schedule (8h) → Define Sources → Switch by Type                │
│                                      ├─ RSS Feed                │
│                                      └─ FireCrawl               │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PROCESSING & FILTERING                         │
├─────────────────────────────────────────────────────────────────┤
│ Merge → Normalize → Filter 7 Days → Check Duplicates           │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AI GENERATION                                │
├─────────────────────────────────────────────────────────────────┤
│ Claude AI → Parse Response → DALL-E Image → Format Data        │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STORAGE & NOTIFICATION                        │
├─────────────────────────────────────────────────────────────────┤
│ Insert Supabase → Success Notification                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                               │
├─────────────────────────────────────────────────────────────────┤
│ Error Trigger → Log Error → Save to DB                         │
└─────────────────────────────────────────────────────────────────┘
```

## Description détaillée des nodes

### 1. Schedule Daily 8AM
**Type**: `n8n-nodes-base.scheduleTrigger`
**Position**: [250, 400]

Déclenche le workflow tous les jours à 8h du matin.

**Configuration**:
- Cron expression: `0 8 * * *`
- Timezone: UTC (à ajuster selon besoin)

**Pourquoi**: Exécution automatique quotidienne pour maintenir un flux régulier de contenu.

---

### 2. Define Sources
**Type**: `n8n-nodes-base.code`
**Position**: [450, 400]

Définit les sources d'articles Philippines à scraper.

**Sources configurées**:
1. **Philippines Tourisme FR** (RSS)
   - URL: https://www.philippines-tourisme.fr/feed/
   - Type: RSS

2. **Expat Philippines** (RSS)
   - URL: https://www.expat.com/fr/destination/asie/philippines/feed/actualites.xml
   - Type: RSS

3. **Rappler Nation** (HTML Dynamic)
   - URL: https://www.rappler.com/nation/
   - Type: HTML Dynamic (via FireCrawl)

**Output**: Array de 3 objets avec `type`, `url`, `name`

---

### 3. Switch by Type
**Type**: `n8n-nodes-base.switch`
**Position**: [650, 400]

Route les sources vers le bon scraper selon leur type.

**Conditions**:
- Case 0: `type === "rss"` → RSS Feed Read
- Case 2: `type === "html_dynamic"` → FireCrawl Scrape

---

### 4. RSS Feed Read
**Type**: `n8n-nodes-base.rssFeedRead`
**Position**: [850, 250]

Lit les flux RSS des sources francophones.

**Configuration**:
- URL: Dynamique depuis `{{ $json.url }}`
- Continue on fail: `true` (pour ne pas bloquer le workflow)

**Output**: Items avec `title`, `link`, `content`, `pubDate`

---

### 5. FireCrawl Scrape
**Type**: `n8n-nodes-base.httpRequest`
**Position**: [850, 550]

Scrape les sites dynamiques via l'API FireCrawl.

**Configuration**:
- Method: POST
- URL FireCrawl API
- Body: `{ url, formats: ["markdown", "html"], onlyMainContent: true }`
- Timeout: 30s
- Credential: FireCrawl API (YXRmcf1SnkuMtkhy)

**Output**: Markdown + HTML du contenu principal

---

### 6. Merge All Sources
**Type**: `n8n-nodes-base.merge`
**Position**: [1050, 400]

Combine les résultats des différents scrapers.

**Mode**: Merge by Position
**Inputs**:
- Input 0: RSS Feed Read
- Input 1: FireCrawl Scrape

---

### 7. Normalize Data
**Type**: `n8n-nodes-base.code`
**Position**: [1250, 400]

Normalise les données de toutes les sources vers un format uniforme.

**Transformation**:
```javascript
{
  source_url: string,      // URL originale
  raw_title: string,       // Titre brut
  raw_content: string,     // Contenu brut
  publication_date: ISO,   // Date de publication
  source_name: string      // Nom de la source
}
```

**Logique**:
- Détecte le type de source (RSS vs FireCrawl)
- Extrait les champs pertinents
- Unifie le format

---

### 8. Filter Last 7 Days
**Type**: `n8n-nodes-base.if`
**Position**: [1450, 400]

Filtre pour ne garder que les articles publiés dans les 7 derniers jours.

**Condition**:
```
publication_date >= now - 7 days
```

**Pourquoi**: Éviter de traiter des articles obsolètes.

---

### 9. Check Duplicate in Supabase
**Type**: `n8n-nodes-base.supabase`
**Position**: [1650, 400]

Vérifie si l'article existe déjà dans la base.

**Query**:
```sql
SELECT * FROM articles
WHERE source_url = '{{ $json.source_url }}'
LIMIT 1
```

**Credential**: Supabase API (Y37r8teOb0npvPKk)

---

### 10. If Not Duplicate
**Type**: `n8n-nodes-base.if`
**Position**: [1850, 400]

Ne continue que si l'article n'existe pas.

**Condition**:
```
length === 0
```

**Pourquoi**: Éviter les doublons dans la base de données.

---

### 11. Claude AI Processing
**Type**: `n8n-nodes-base.anthropic`
**Position**: [2050, 400]

Le cœur du workflow - Utilise Claude 3.5 Sonnet pour réécrire l'article.

**Configuration**:
- Model: `claude-3-5-sonnet-20241022`
- Temperature: 0.7
- Max Tokens: 4096

**Prompt complet** (voir fichier JSON):
Le prompt demande à Claude de:
1. Réécrire en français pour public francophone
2. Structure SEO optimisée (H1, H2, H3)
3. Format EditorJS strict
4. Meta description 150-160 caractères
5. Slug SEO-friendly
6. Description pour image DALL-E
7. Ton engageant avec tutoiement

**Output JSON attendu**:
```json
{
  "title": "...",
  "slug": "...",
  "meta_description": "...",
  "category_id": 11,
  "status": "draft",
  "image_prompt": "...",
  "content_editorjs": {
    "time": 1234567890,
    "blocks": [...],
    "version": "2.28.2"
  }
}
```

---

### 12. Parse AI Response
**Type**: `n8n-nodes-base.code`
**Position**: [2250, 400]

Parse la réponse de Claude pour extraire le JSON.

**Logique**:
- Gère les cas où Claude entoure le JSON de markdown
- Extrait le JSON via regex
- Valide et parse
- Gestion d'erreur si parsing échoue

---

### 13. DALL-E Generate Image
**Type**: `n8n-nodes-base.openAi`
**Position**: [2450, 400]

Génère une image de bannière via DALL-E 3.

**Configuration**:
- Model: DALL-E 3
- Size: 1792x1024 (format banner)
- Quality: Standard
- Style: Vivid
- Prompt: `{{ $json.image_prompt }}` (généré par Claude)

**Credential**: OpenAI API (ZxSYZtBStDBWN5Uu)

**Output**: URL de l'image générée

---

### 14. Format Final Data
**Type**: `n8n-nodes-base.code`
**Position**: [2650, 400]

Prépare les données finales pour insertion en base.

**Calculs**:
- **Reading time**: Compte les mots dans les blocks EditorJS (200 mots/min)
- **Published_at**: Timestamp actuel

**Output final**:
```json
{
  "title": "...",
  "slug": "...",
  "content": { EditorJS object },
  "content_preview": "meta description",
  "category_id": 11,
  "image": "URL DALL-E",
  "status": "draft",
  "source": "n8n",
  "source_url": "URL originale",
  "reading_time": 5,
  "published_at": "2026-01-08T..."
}
```

---

### 15. Insert to Supabase
**Type**: `n8n-nodes-base.supabase`
**Position**: [2850, 400]

Insère l'article dans la table `articles`.

**Opération**: INSERT
**Table**: `articles`
**Colonnes**: title, slug, content, content_preview, category_id, image, status, source, source_url, reading_time, published_at

**Credential**: Supabase API (Y37r8teOb0npvPKk)

---

### 16. Success Notification
**Type**: `n8n-nodes-base.code`
**Position**: [3050, 400]

Notification de succès dans les logs.

**Output**:
```javascript
{
  success: true,
  message: "Article \"...\" créé avec succès",
  slug: "...",
  timestamp: "..."
}
```

---

## Error Handling Workflow

### 17. Error Trigger
**Type**: `n8n-nodes-base.errorTrigger`
**Position**: [250, 650]

S'active automatiquement si une erreur survient dans le workflow principal.

**Reçoit**:
- Execution ID
- Workflow info
- Error message
- Node where error occurred

---

### 18. Log Error
**Type**: `n8n-nodes-base.code`
**Position**: [450, 650]

Formate et log l'erreur dans la console.

**Log format**:
```json
{
  "timestamp": "...",
  "workflow": "Philippineasy - Article Automation",
  "execution_id": "...",
  "node": "Node Name",
  "error": "Error message",
  "stack": "Stack trace"
}
```

---

### 19. Save Error to DB
**Type**: `n8n-nodes-base.supabase`
**Position**: [650, 650]

Sauvegarde l'erreur dans une table dédiée.

**Table**: `workflow_errors`
**Continue on fail**: `true` (pour ne pas créer une boucle d'erreur)

---

## Prérequis

### Credentials n8n

1. **FireCrawl API** (ID: YXRmcf1SnkuMtkhy)
   - Obtenir une clé API sur https://firecrawl.dev
   - Configurer dans n8n: Settings > Credentials > New > FireCrawl API

2. **OpenAI API** (ID: ZxSYZtBStDBWN5Uu)
   - Obtenir une clé API sur https://platform.openai.com
   - Configurer dans n8n: Settings > Credentials > New > OpenAI API
   - Nécessite accès à DALL-E 3

3. **Anthropic API** (pour Claude)
   - Obtenir une clé API sur https://console.anthropic.com
   - Configurer dans n8n: Settings > Credentials > New > Anthropic API
   - Modèle: claude-3-5-sonnet-20241022

4. **Supabase API** (ID: Y37r8teOb0npvPKk)
   - URL: Votre instance Supabase
   - API Key: Service role key (pour opérations backend)
   - Configurer dans n8n: Settings > Credentials > New > Supabase

### Base de données Supabase

#### Table `articles`

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug VARCHAR(75) UNIQUE NOT NULL,
  content JSONB NOT NULL,  -- EditorJS format
  content_preview TEXT,     -- Meta description
  category_id INTEGER,
  image TEXT,               -- URL
  status VARCHAR(20) DEFAULT 'draft',
  author_id UUID,
  reading_time INTEGER,
  source VARCHAR(50) DEFAULT 'n8n',
  source_url TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_source_url ON articles(source_url);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
```

#### Table `workflow_errors` (pour error logging)

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

### Variables d'environnement

Aucune variable d'environnement directe nécessaire, tout est géré via credentials n8n.

---

## Instructions d'import

### 1. Préparation

1. Assurez-vous que toutes les credentials sont configurées dans n8n
2. Créez les tables Supabase si nécessaire
3. Vérifiez que vous avez des crédits API (OpenAI, Anthropic, FireCrawl)

### 2. Import du workflow

**Méthode 1: Interface n8n**
1. Ouvrez n8n
2. Cliquez sur "Workflows" dans le menu
3. Cliquez sur le bouton "Import from File"
4. Sélectionnez le fichier `philippineasy-article-automation.json`
5. Cliquez sur "Import"

**Méthode 2: Ligne de commande (self-hosted)**
```bash
# Copier le fichier JSON dans le dossier n8n
cp philippineasy-article-automation.json ~/.n8n/workflows/

# Redémarrer n8n
n8n restart
```

### 3. Configuration post-import

1. **Vérifier les credentials**:
   - Ouvrir chaque node avec credentials
   - Sélectionner la bonne credential si multiple
   - Tester la connection

2. **Ajuster les IDs de credentials**:
   Si vos IDs de credentials sont différents, mettez à jour dans les nodes:
   - FireCrawl Scrape
   - DALL-E Generate Image
   - Claude AI Processing
   - Check Duplicate in Supabase
   - Insert to Supabase
   - Save Error to DB

3. **Personnaliser le prompt Claude**:
   - Ouvrir le node "Claude AI Processing"
   - Ajuster le prompt si besoin (category_id, ton, etc.)

4. **Ajuster le schedule**:
   - Ouvrir "Schedule Daily 8AM"
   - Modifier l'expression cron si souhaité
   - Ajuster la timezone

### 4. Test du workflow

**Test manuel**:
1. Cliquez sur "Execute Workflow" en haut à droite
2. Le workflow va s'exécuter immédiatement
3. Vérifiez chaque node pour voir les données
4. Vérifiez que l'article est créé dans Supabase

**Test avec une seule source**:
1. Ouvrir "Define Sources"
2. Commenter toutes les sources sauf une
3. Exécuter le workflow
4. Vérifier le résultat

### 5. Activation

1. Cliquez sur le toggle "Active" en haut à gauche
2. Le workflow s'exécutera automatiquement selon le schedule
3. Surveillez les logs et la table `workflow_errors`

---

## Monitoring et maintenance

### Vérifications quotidiennes

1. **Vérifier les articles créés**:
```sql
SELECT title, slug, created_at, source_url
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 10;
```

2. **Vérifier les erreurs**:
```sql
SELECT * FROM workflow_errors
ORDER BY timestamp DESC
LIMIT 10;
```

3. **Vérifier les exécutions** dans l'interface n8n:
   - Executions > View all executions
   - Filtrer par workflow
   - Vérifier les failed executions

### Alertes recommandées

1. **Pas d'articles créés depuis 24h**:
   - Vérifier les sources (sont-elles down?)
   - Vérifier les credentials API
   - Vérifier les quotas API

2. **Taux d'erreur élevé**:
   - Consulter `workflow_errors`
   - Identifier le node problématique
   - Corriger la source du problème

3. **Coûts API élevés**:
   - Monitorer les usages OpenAI/Anthropic
   - Ajuster le nombre de sources
   - Limiter la fréquence d'exécution

### Optimisations possibles

1. **Ajouter un Split In Batches**:
   - Entre "Normalize Data" et "Filter Last 7 Days"
   - Traiter 5 articles à la fois
   - Éviter les timeouts

2. **Ajouter un cache**:
   - Stocker les source_url déjà traitées en mémoire
   - Éviter les requêtes Supabase répétées

3. **Paralléliser le scraping**:
   - Utiliser plusieurs branches parallèles
   - Un scraper par source
   - Merger à la fin

4. **Ajouter une validation de contenu**:
   - Vérifier que Claude a bien retourné un JSON valide
   - Vérifier que le slug est unique
   - Vérifier que l'image a été générée

---

## Troubleshooting

### Problème: Le workflow ne se déclenche pas

**Solutions**:
1. Vérifier que le workflow est "Active"
2. Vérifier l'expression cron dans le Schedule
3. Vérifier la timezone
4. Vérifier les logs n8n

### Problème: Pas d'articles RSS récupérés

**Solutions**:
1. Tester les URLs RSS dans un navigateur
2. Vérifier que les flux sont valides
3. Augmenter le timeout
4. Vérifier les logs d'erreur

### Problème: FireCrawl échoue

**Solutions**:
1. Vérifier la clé API FireCrawl
2. Vérifier les quotas/crédits
3. Tester l'URL manuellement sur FireCrawl
4. Vérifier que le site n'est pas down

### Problème: Claude retourne un JSON invalide

**Solutions**:
1. Améliorer le prompt (être plus strict)
2. Ajouter des exemples dans le prompt
3. Augmenter max_tokens si tronqué
4. Vérifier les logs Claude pour voir la réponse brute

### Problème: DALL-E génère des images non pertinentes

**Solutions**:
1. Améliorer le prompt Claude pour image_prompt
2. Ajouter des mots-clés spécifiques ("Philippines", "landscape", etc.)
3. Tester différents styles DALL-E
4. Utiliser un modèle d'image alternatif

### Problème: Erreur d'insertion Supabase

**Solutions**:
1. Vérifier que la table existe
2. Vérifier les permissions (service role key)
3. Vérifier que le content est bien un JSONB valide
4. Vérifier les contraintes (slug unique, etc.)

### Problème: Doublons malgré le check

**Solutions**:
1. Vérifier la requête SQL de check
2. Ajouter un index sur source_url
3. Utiliser une contrainte UNIQUE sur source_url
4. Vérifier le timing (race condition?)

---

## Améliorations futures

### Court terme

1. **Notification Slack/Discord**:
   - Ajouter un node Slack après Success Notification
   - Envoyer un message avec titre + lien

2. **Dashboard de stats**:
   - Nombre d'articles créés par jour
   - Taux de succès
   - Sources les plus productives

3. **Catégorisation automatique**:
   - Demander à Claude de choisir la category_id appropriée
   - Basé sur le contenu de l'article

### Moyen terme

1. **Validation humaine**:
   - Tous les articles en "draft"
   - Webhook pour validation
   - Publication manuelle ou automatique après X jours

2. **Enrichissement SEO**:
   - Générer les meta tags complets
   - Suggérer des internal links
   - Analyser les keywords

3. **Multi-langue**:
   - Détecter la langue source
   - Traduire en plusieurs langues
   - Créer plusieurs versions

### Long terme

1. **RAG pour contexte**:
   - Indexer tous les articles existants
   - Donner du contexte à Claude
   - Éviter les répétitions

2. **A/B Testing**:
   - Générer plusieurs versions de titre
   - Tester l'engagement
   - Choisir le meilleur

3. **Auto-publication**:
   - Score de qualité de l'article
   - Si score > seuil → auto-publish
   - Sinon → review humaine

---

## Coûts estimés

### Par article généré

- **Claude 3.5 Sonnet**: ~$0.03 (1000 tokens input + 2000 tokens output)
- **DALL-E 3 (1792x1024)**: ~$0.08
- **FireCrawl**: ~$0.01 (si utilisé)
- **Total par article**: ~$0.12

### Par mois (1 article/jour)

- 30 articles × $0.12 = **~$3.60/mois**

### Optimisations de coût

1. Utiliser Claude Haiku pour la catégorisation simple
2. Utiliser DALL-E 2 si qualité acceptable
3. Réduire max_tokens Claude
4. Cacher les images générées

---

## Support

Pour toute question ou problème:

1. Consulter les logs n8n
2. Vérifier la table `workflow_errors`
3. Tester les credentials
4. Consulter la documentation n8n: https://docs.n8n.io

---

**Créé le**: 2026-01-08
**Version**: 1.0.0
**Auteur**: Claude Code (n8n-workflow-creator)
**Status**: PRODUCTION READY
