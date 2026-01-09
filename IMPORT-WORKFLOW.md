# Guide d'Import du Workflow Corrigé

## Étapes Rapides

### Option 1: Via CLI (Recommandé)

```bash
# 1. Se placer dans le répertoire du projet
cd "/Users/machugo/Documents/Philippineasy website 2026"

# 2. Importer le workflow corrigé
n8n import:workflow --input="./philippineasy-article-automation-v2.json"

# 3. Vérifier que l'import a réussi
n8n export:workflow --all | jq '.[] | select(.name == "Philippineasy - Article Automation V2")'

# 4. Activer le workflow
n8n update:workflow --id=ZwauIvEKF2H6PJZb --active=true
```

---

### Option 2: Via l'interface n8n

1. Ouvrir n8n dans le navigateur: http://localhost:5678
2. Aller dans "Workflows"
3. Cliquer sur le menu "..." à côté de "Philippineasy - Article Automation V2"
4. Sélectionner "Import from File"
5. Choisir le fichier: `philippineasy-article-automation-v2.json`
6. Confirmer l'écrasement du workflow existant
7. Vérifier que la version affichée est "2.0.1"
8. Activer le workflow

---

## Vérifications Post-Import

### Vérification 1: Nodes ajoutés/modifiés

Ouvrir le workflow dans n8n et vérifier les nodes suivants:

#### Node "Prepare Article Data" (NOUVEAU)
- Position: Entre "If Not Duplicate" et "GPT-4 Article Writer"
- Type: Code
- Contenu: Récupère les données originales depuis "Process One by One"
- Note visible: "FIX: Recupere les donnees originales au lieu d'utiliser Merge problematique"

#### Node "DALL-E Generate Image" (MODIFIÉ)
- Paramètre "Continue On Fail": ACTIVÉ (checkbox cochée)
- Note visible: "FIX: Continue on fail pour ne pas bloquer si DALL-E echoue"

#### Node "Parse AI Response" (MODIFIÉ)
- Note visible: "FIX: Reference correcte a source_url depuis Process One by One"

#### Node "Format Final Data" (MODIFIÉ)
- Note visible: "FIX: Ajout d'un fallback si image DALL-E manquante"
- Code contient: `https://placehold.co/1792x1024/1e40af/white?text=Philippineasy`

---

### Vérification 2: Connexions

Le flux doit être:

```
If Not Duplicate
       ↓
Prepare Article Data (NOUVEAU NODE)
       ↓
GPT-4 Article Writer
       ↓
Parse AI Response
       ↓
DALL-E Generate Image
       ↓
Format Final Data
       ↓
Insert to Supabase
       ↓
Log Success
       ↓
Process One by One (boucle)
```

Le node "Merge Original Data" NE DOIT PLUS EXISTER.

---

### Vérification 3: Version du workflow

Vérifier dans les paramètres du workflow:
- Version: 2.0.1
- Active: false (à activer manuellement après test)

---

## Test du Workflow

### Test 1: Exécution manuelle

1. Ouvrir le workflow dans n8n
2. Cliquer sur "Execute Workflow"
3. Laisser tourner (peut prendre 2-3 minutes)
4. Vérifier qu'aucune erreur rouge n'apparaît
5. Vérifier la sortie du node "Log Success"

#### Résultat attendu:
```json
{
  "success": true,
  "message": "Article \"[titre]\" cree avec succes",
  "article_id": "123",
  "slug": "slug-de-l-article",
  "url": "https://philippineasy.com/articles/slug-de-l-article",
  "timestamp": "2026-01-08T..."
}
```

---

### Test 2: Vérifier dans Supabase

#### SQL à exécuter dans Supabase SQL Editor:

```sql
-- Voir les derniers articles créés
SELECT
  id,
  title,
  slug,
  image,
  source_url,
  created_at
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 5;
```

#### Vérifier:
- [ ] `title` est rempli
- [ ] `slug` est valide (lowercase, tirets, sans accents)
- [ ] `image` n'est PAS null (soit DALL-E, soit placeholder)
- [ ] `source_url` est rempli et valide
- [ ] `content` contient du JSON Editor.js valide

---

### Test 3: Simuler échec DALL-E

Pour s'assurer que le fallback fonctionne:

1. Dans n8n, aller dans "Credentials"
2. Trouver "OpenAi account 3"
3. Temporairement modifier l'API key pour la rendre invalide
4. Exécuter le workflow manuellement
5. Vérifier que l'article est quand même créé
6. Vérifier dans Supabase que `image` = `https://placehold.co/1792x1024/1e40af/white?text=Philippineasy`
7. Restaurer l'API key correcte

---

### Test 4: Vérifier les logs d'erreur

```sql
-- Voir les erreurs récentes
SELECT
  timestamp,
  node,
  error_message,
  severity
FROM n8n_logs
WHERE workflow = 'Philippineasy Article Automation'
  AND severity = 'error'
ORDER BY timestamp DESC
LIMIT 10;
```

Si tout va bien, cette requête doit retourner 0 lignes après un test réussi.

---

## Activation du Workflow

Une fois tous les tests réussis:

### Via CLI:
```bash
n8n update:workflow --id=ZwauIvEKF2H6PJZb --active=true
```

### Via l'interface:
1. Ouvrir le workflow
2. Cliquer sur le toggle "Active" en haut à droite
3. Confirmer

Le workflow s'exécutera automatiquement tous les jours à 8h du matin.

---

## Monitoring

### Voir les exécutions automatiques

#### Via CLI:
```bash
# Dernières exécutions
sqlite3 ~/.n8n/database.sqlite "
SELECT
  id,
  status,
  stoppedAt,
  data
FROM execution_entity
WHERE workflowId = 'ZwauIvEKF2H6PJZb'
ORDER BY stoppedAt DESC
LIMIT 5;
"
```

#### Via l'interface n8n:
1. Aller dans "Executions"
2. Filtrer par workflow: "Philippineasy - Article Automation V2"
3. Vérifier les statuts (success / error)

---

### Dashboard Supabase

Créer une vue pour monitorer:

```sql
CREATE OR REPLACE VIEW n8n_workflow_stats AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as articles_created,
  COUNT(CASE WHEN image LIKE '%placehold%' THEN 1 END) as images_fallback,
  COUNT(CASE WHEN image NOT LIKE '%placehold%' THEN 1 END) as images_dalle
FROM articles
WHERE source = 'n8n'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Voir les stats
SELECT * FROM n8n_workflow_stats LIMIT 30;
```

---

## Troubleshooting

### Problème: "Cannot read property of undefined"

**Cause probable**: Le node "Prepare Article Data" n'a pas été importé correctement

**Solution**:
1. Vérifier que le node existe dans le workflow
2. Vérifier les connexions entre nodes
3. Réimporter le workflow

---

### Problème: "Invalid JSON in Parse AI Response"

**Cause probable**: GPT-4 a retourné un format inattendu

**Solution**:
1. Vérifier les logs du node "GPT-4 Article Writer"
2. Ajuster le prompt si nécessaire
3. Vérifier que `jsonOutput: true` est activé

---

### Problème: Articles sans image

**Cause probable**: Le fallback n'a pas été importé

**Solution**:
1. Ouvrir le node "Format Final Data"
2. Vérifier que le code contient le fallback:
```javascript
if (!imageUrl || imageUrl === '') {
  imageUrl = 'https://placehold.co/1792x1024/1e40af/white?text=Philippineasy';
  console.log('DALL-E a echoue, utilisation d\'une image placeholder');
}
```

---

### Problème: source_url est null dans Supabase

**Cause probable**: Le node "Prepare Article Data" ne passe pas les données correctement

**Solution**:
1. Vérifier le code du node "Prepare Article Data"
2. Vérifier que la connexion entre "If Not Duplicate" et "Prepare Article Data" existe
3. Tester manuellement le node

---

## Rollback (si besoin)

Si le nouveau workflow pose problème, revenir à l'ancienne version:

```bash
# Exporter l'ancienne version (si sauvegardée)
n8n export:workflow --id=ZwauIvEKF2H6PJZb --output=backup-v2.0.0.json

# Réimporter l'ancienne version
n8n import:workflow --input=backup-v2.0.0.json
```

Mais normalement, la nouvelle version devrait être plus stable.

---

## Support

- Consulter le rapport détaillé: `workflow-fix-report.md`
- Logs Supabase: Table `n8n_logs`
- Knowledge base: `~/.claude/n8n-knowledge/`

**Date de création de ce guide**: 2026-01-08
