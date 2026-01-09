# Workflow Test Checklist

## Tests unitaires par node

### ✅ 1. Schedule Daily 8AM
- [ ] Expression cron correcte: `0 8 * * *`
- [ ] Timezone appropriée
- [ ] Test manuel déclenche le workflow

**Test**:
```javascript
// Vérifier que le trigger s'active
// Execute Workflow manuellement
```

---

### ✅ 2. Define Sources
- [ ] Retourne 3 sources
- [ ] Chaque source a: type, url, name
- [ ] Types: 2x "rss", 1x "html_dynamic"

**Test**:
```javascript
// Output attendu:
[
  { type: 'rss', url: '...philippines-tourisme.fr/feed/', name: '...' },
  { type: 'rss', url: '...expat.com/.../feed/...', name: '...' },
  { type: 'html_dynamic', url: '...rappler.com/nation/', name: '...' }
]
```

---

### ✅ 3. Switch by Type
- [ ] Route RSS vers "RSS Feed Read"
- [ ] Route html_dynamic vers "FireCrawl Scrape"
- [ ] Pas de routes manquées

**Test**:
```javascript
// Vérifier que les 2 branches RSS vont vers RSS Feed Read
// Vérifier que la branche html_dynamic va vers FireCrawl
```

---

### ✅ 4. RSS Feed Read
- [ ] Lit les flux RSS correctement
- [ ] Retourne title, link, content, pubDate
- [ ] Continue on fail activé
- [ ] Timeout approprié

**Test**:
```bash
# Tester les URLs RSS manuellement
curl "https://www.philippines-tourisme.fr/feed/"
curl "https://www.expat.com/fr/destination/asie/philippines/feed/actualites.xml"
```

**Vérification output**:
- [ ] Items avec structure correcte
- [ ] Dates parsées en ISO
- [ ] Contenu non vide

---

### ✅ 5. FireCrawl Scrape
- [ ] Credential FireCrawl configurée
- [ ] URL dynamique depuis $json.url
- [ ] Body JSON correct: formats, onlyMainContent
- [ ] Timeout 30s
- [ ] Continue on fail activé

**Test**:
```bash
# Tester FireCrawl manuellement
curl -X POST https://api.firecrawl.dev/v0/scrape \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.rappler.com/nation/",
    "formats": ["markdown", "html"],
    "onlyMainContent": true
  }'
```

**Vérification output**:
- [ ] Markdown content présent
- [ ] HTML content présent
- [ ] Pas d'erreur 401/403

---

### ✅ 6. Merge All Sources
- [ ] Combine RSS + FireCrawl
- [ ] Mode: mergeByPosition
- [ ] Tous les items fusionnés

**Test**:
```javascript
// Vérifier que le output contient les items des 2 branches
// Count total = items RSS + items FireCrawl
```

---

### ✅ 7. Normalize Data
- [ ] Détecte type RSS vs FireCrawl
- [ ] Extrait source_url
- [ ] Extrait raw_title, raw_content
- [ ] Parse publication_date
- [ ] Assigne source_name

**Test output**:
```json
{
  "source_url": "https://...",
  "raw_title": "Titre article",
  "raw_content": "Contenu...",
  "publication_date": "2026-01-08T...",
  "source_name": "Philippines Tourisme FR"
}
```

**Vérifications**:
- [ ] Tous les champs présents
- [ ] Date en ISO 8601
- [ ] Content non vide

---

### ✅ 8. Filter Last 7 Days
- [ ] Condition: date >= now - 7 days
- [ ] Filtre correctement les vieux articles
- [ ] Garde les articles récents

**Test**:
```javascript
// Tester avec date > 7 jours → doit être filtré
// Tester avec date < 7 jours → doit passer
const testDate1 = new Date('2026-01-01'); // Filtré
const testDate2 = new Date(); // Passe
```

---

### ✅ 9. Check Duplicate in Supabase
- [ ] Credential Supabase configurée
- [ ] Query SQL correcte
- [ ] Filtre sur source_url
- [ ] Retourne array vide si pas de doublon

**Test**:
```sql
-- Tester la query manuellement dans Supabase
SELECT * FROM articles
WHERE source_url = 'https://example.com/article'
LIMIT 1;
```

**Vérifications**:
- [ ] Connection Supabase OK
- [ ] Query s'exécute sans erreur
- [ ] Retourne [] si nouveau, [item] si existe

---

### ✅ 10. If Not Duplicate
- [ ] Condition: length === 0
- [ ] Continue si nouveau
- [ ] Stop si doublon

**Test**:
```javascript
// Si query retourne [], length = 0 → continue
// Si query retourne [item], length = 1 → stop
```

---

### ✅ 11. Claude AI Processing
- [ ] Credential Anthropic configurée
- [ ] Model: claude-3-5-sonnet-20241022
- [ ] Temperature: 0.7
- [ ] Max tokens: 4096
- [ ] Prompt complet et correct

**Test**:
```bash
# Tester Claude API manuellement
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**Vérifications output**:
- [ ] Retourne un JSON valide
- [ ] Contient tous les champs requis
- [ ] content_editorjs bien structuré
- [ ] Slug <= 75 chars
- [ ] Meta description 150-160 chars

---

### ✅ 12. Parse AI Response
- [ ] Parse JSON de Claude
- [ ] Gère les cas avec markdown
- [ ] Gestion d'erreur si parsing échoue
- [ ] Retourne objet structuré

**Test**:
```javascript
// Tester avec JSON simple
const response1 = '{"title": "Test"}';

// Tester avec markdown autour
const response2 = '```json\n{"title": "Test"}\n```';

// Tester parsing invalide (doit throw)
const response3 = 'not json';
```

---

### ✅ 13. DALL-E Generate Image
- [ ] Credential OpenAI configurée
- [ ] Model: dall-e-3
- [ ] Size: 1792x1024
- [ ] Quality: standard
- [ ] Style: vivid
- [ ] Prompt depuis $json.image_prompt

**Test**:
```bash
# Tester DALL-E manuellement
curl https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "Beautiful Philippine beach at sunset",
    "size": "1792x1024",
    "quality": "standard"
  }'
```

**Vérifications**:
- [ ] Retourne URL d'image
- [ ] Image accessible
- [ ] Format correct (1792x1024)

---

### ✅ 14. Format Final Data
- [ ] Calcul reading_time correct
- [ ] Compte les mots dans blocks
- [ ] Formule: wordCount / 200
- [ ] Structure finale correcte

**Test**:
```javascript
// Tester calcul reading_time
const blocks = [
  { type: 'paragraph', data: { text: 'word '.repeat(200) } },
  { type: 'paragraph', data: { text: 'word '.repeat(200) } }
];
// Expected: 400 words / 200 = 2 minutes
```

**Vérifications output**:
```json
{
  "title": "...",
  "slug": "...",
  "content": { EditorJS },
  "content_preview": "...",
  "category_id": 11,
  "image": "https://...",
  "status": "draft",
  "source": "n8n",
  "source_url": "https://...",
  "reading_time": 5,
  "published_at": "2026-01-08T..."
}
```

---

### ✅ 15. Insert to Supabase
- [ ] Credential Supabase configurée
- [ ] Operation: insert
- [ ] Table: articles
- [ ] Toutes les colonnes mappées
- [ ] Pas d'erreur de contrainte

**Test**:
```sql
-- Vérifier après insertion
SELECT * FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 1;
```

**Vérifications**:
- [ ] Article inséré
- [ ] content est JSONB valide
- [ ] slug est unique
- [ ] Dates correctes

---

### ✅ 16. Success Notification
- [ ] Log dans console
- [ ] Message clair
- [ ] Contient titre + slug
- [ ] Timestamp

**Test**:
```javascript
// Vérifier dans les logs n8n
console.log('Article créé:', title, slug);
```

---

### ✅ 17. Error Trigger
- [ ] S'active en cas d'erreur
- [ ] Reçoit execution info
- [ ] Reçoit error details
- [ ] Reçoit workflow info

**Test**:
```javascript
// Forcer une erreur dans un node (ex: mauvaise credential)
// Vérifier que Error Trigger s'active
```

---

### ✅ 18. Log Error
- [ ] Formate l'erreur
- [ ] Log dans console
- [ ] Structure JSON claire
- [ ] Contient stack trace

**Vérifications**:
- [ ] Timestamp présent
- [ ] Node identifié
- [ ] Message d'erreur clair

---

### ✅ 19. Save Error to DB
- [ ] Insert dans workflow_errors
- [ ] Toutes les colonnes remplies
- [ ] Continue on fail activé

**Test**:
```sql
-- Vérifier les erreurs loggées
SELECT * FROM workflow_errors
ORDER BY timestamp DESC
LIMIT 5;
```

---

## Tests d'intégration

### ✅ Test End-to-End complet
- [ ] Exécution manuelle réussie
- [ ] Tous les nodes passent
- [ ] Article créé dans Supabase
- [ ] Image générée
- [ ] Pas d'erreurs

**Procédure**:
1. Cliquer "Execute Workflow"
2. Attendre fin d'exécution (2-3 min)
3. Vérifier chaque node (vert = succès)
4. Vérifier article dans Supabase

---

### ✅ Test avec doublon
- [ ] Insérer un article manuellement avec source_url
- [ ] Exécuter workflow avec même source_url
- [ ] Vérifier qu'il est filtré à "If Not Duplicate"
- [ ] Pas de doublon créé

**Test**:
```sql
-- Insérer un doublon
INSERT INTO articles (title, slug, content, source_url)
VALUES ('Test', 'test-doublon', '{}'::jsonb, 'https://test-url.com');

-- Exécuter workflow
-- Vérifier que pas de nouveau avec cette source_url
```

---

### ✅ Test avec articles anciens
- [ ] Modifier "Define Sources" pour pointer vers flux avec vieux articles
- [ ] Exécuter workflow
- [ ] Vérifier que filtrés à "Filter Last 7 Days"

---

### ✅ Test error handling
- [ ] Désactiver temporairement une credential
- [ ] Exécuter workflow
- [ ] Vérifier que Error Trigger s'active
- [ ] Vérifier que erreur loggée dans workflow_errors

---

### ✅ Test schedule
- [ ] Workflow activé
- [ ] Attendre le prochain trigger (8h)
- [ ] Vérifier que s'exécute automatiquement
- [ ] Vérifier résultat

**Alternative (test rapide)**:
```javascript
// Modifier temporairement le cron pour trigger dans 2 minutes
// Expression: */2 * * * *
// Vérifier que s'exécute
// Remettre à 0 8 * * *
```

---

## Tests de performance

### ✅ Volume test
- [ ] Tester avec 10+ articles
- [ ] Vérifier que pas de timeout
- [ ] Vérifier que tous traités
- [ ] Temps d'exécution raisonnable (<10 min)

---

### ✅ Concurrent executions
- [ ] Exécuter workflow manuellement 2 fois rapidement
- [ ] Vérifier que pas de conflit
- [ ] Vérifier que pas de doublons

---

## Tests de sécurité

### ✅ Credentials
- [ ] Service Role Key utilisée (pas anon)
- [ ] API keys en credentials (pas en dur)
- [ ] Pas de secrets dans le code

---

### ✅ Injection SQL
- [ ] Source_url échappée dans query
- [ ] Pas de concatenation directe

---

## Tests de coûts

### ✅ Monitoring API usage
- [ ] Vérifier coûts Anthropic après 1 article
- [ ] Vérifier coûts OpenAI après 1 image
- [ ] Estimer coûts mensuels
- [ ] Configurer billing alerts

**Coûts attendus par article**:
- Claude: ~$0.03
- DALL-E: ~$0.08
- FireCrawl: ~$0.01
- **Total**: ~$0.12

---

## Checklist finale avant production

- [ ] Tous les tests unitaires passent
- [ ] Tests d'intégration réussis
- [ ] Error handling fonctionne
- [ ] Credentials sécurisées
- [ ] Tables Supabase créées avec indexes
- [ ] Monitoring en place
- [ ] Billing alerts configurés
- [ ] Documentation à jour
- [ ] Workflow activé

---

## Suivi post-déploiement

### Jour 1
- [ ] Vérifier première exécution automatique
- [ ] Vérifier article créé
- [ ] Vérifier qualité de l'article
- [ ] Vérifier coûts API

### Semaine 1
- [ ] 7 articles créés
- [ ] Pas d'erreurs critiques
- [ ] Qualité constante
- [ ] Coûts dans budget

### Mois 1
- [ ] ~30 articles créés
- [ ] Taux de succès >90%
- [ ] Optimisations identifiées
- [ ] ROI évalué

---

**Status**: Ready for Testing
**Last updated**: 2026-01-08
