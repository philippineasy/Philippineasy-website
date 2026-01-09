# Correction du Node "Insert to Supabase"

## Problème identifié

```
Node: Insert to Supabase (ID: o5p6q7r8-s9t0-1234-opqr-345678901234)
Erreur: "Could not get parameter"
Cause: Paramètre "dataMode: autoMapInputData" non supporté
```

## Solution appliquée

### Avant (INCORRECT)
```json
{
  "parameters": {
    "operation": "insert",
    "tableId": "articles",
    "dataMode": "autoMapInputData",  ❌
    "options": {}
  }
}
```

### Après (CORRECT)
```json
{
  "parameters": {
    "operation": "insert",
    "tableId": "articles",
    "fieldsToSend": "defineBelow",  ✅
    "fieldsUi": {
      "fieldValues": [
        { "fieldId": "title", "fieldValue": "={{ $json.title }}" },
        { "fieldId": "slug", "fieldValue": "={{ $json.slug }}" },
        { "fieldId": "content", "fieldValue": "={{ $json.content }}" },
        { "fieldId": "content_preview", "fieldValue": "={{ $json.content_preview }}" },
        { "fieldId": "category_id", "fieldValue": "={{ $json.category_id }}" },
        { "fieldId": "image", "fieldValue": "={{ $json.image }}" },
        { "fieldId": "status", "fieldValue": "={{ $json.status }}" },
        { "fieldId": "source", "fieldValue": "={{ $json.source }}" },
        { "fieldId": "source_url", "fieldValue": "={{ $json.source_url }}" },
        { "fieldId": "reading_time", "fieldValue": "={{ $json.reading_time }}" }
      ]
    },
    "options": {}
  }
}
```

## Fichiers modifiés

1. `/Users/machugo/Documents/Philippineasy website 2026/philippineasy-article-automation-v2.json`
   - Node "Insert to Supabase" corrigé (ligne 342-405)
   - Node "Save Error Log" corrigé (ligne 434-482)

## Déploiement

### Étape 1: Exécuter le script de correction

```bash
chmod +x "/Users/machugo/Documents/Philippineasy website 2026/fix-workflow.sh"
bash "/Users/machugo/Documents/Philippineasy website 2026/fix-workflow.sh"
```

### Étape 2: Vérifier dans n8n

1. Ouvrir http://localhost:5678
2. Chercher "Philippineasy - Article Automation V2"
3. Ouvrir le workflow
4. Cliquer sur le node "Insert to Supabase"
5. Vérifier la configuration:
   - Fields to Send: "Define Below"
   - Tous les champs mappés correctement

### Étape 3: Test manuel

1. Dans n8n, cliquer sur "Execute Workflow" (bouton test)
2. Observer l'exécution complète
3. Vérifier dans Supabase que l'article a été inséré

### Étape 4: Nettoyage

Si des workflows doublons existent:
```bash
# Lister les workflows
n8n export:workflow --all | jq '.[] | select(.name | contains("Philippineasy")) | {id, name, active}'

# Désactiver un workflow doublon
n8n update:workflow --id=<OLD_ID> --active=false

# Supprimer depuis l'UI n8n (pas de commande CLI disponible)
```

## Validation des données

### Format d'entrée attendu (depuis "Format Final Data")

```json
{
  "title": "string (50-150 chars)",
  "slug": "string (kebab-case, 50-75 chars)",
  "content": "string (JSON stringified Editor.js)",
  "content_preview": "string (155-160 chars)",
  "category_id": "integer",
  "image": "string (URL)",
  "status": "string (draft|published)",
  "source": "string (n8n)",
  "source_url": "string (URL)",
  "reading_time": "integer (minutes)"
}
```

### Table Supabase `articles`

| Colonne | Type | Nullable | Default |
|---------|------|----------|---------|
| id | uuid | false | gen_random_uuid() |
| title | text | false | - |
| slug | text | false | - |
| content | jsonb | false | - |
| content_preview | text | true | - |
| category_id | int | false | - |
| image | text | true | - |
| status | text | false | 'draft' |
| source | text | true | - |
| source_url | text | true | - |
| reading_time | int | true | - |
| created_at | timestamp | false | now() |
| updated_at | timestamp | false | now() |

## Autres corrections appliquées

### Node "Save Error Log" (n8n_logs table)

Même correction appliquée pour maintenir la cohérence:

```json
{
  "fieldsToSend": "defineBelow",
  "fieldsUi": {
    "fieldValues": [
      { "fieldId": "timestamp", "fieldValue": "={{ $json.timestamp }}" },
      { "fieldId": "workflow", "fieldValue": "={{ $json.workflow }}" },
      { "fieldId": "execution_id", "fieldValue": "={{ $json.execution_id }}" },
      { "fieldId": "node", "fieldValue": "={{ $json.node }}" },
      { "fieldId": "error_message", "fieldValue": "={{ $json.error_message }}" },
      { "fieldId": "severity", "fieldValue": "={{ $json.severity }}" }
    ]
  }
}
```

## Checklist finale

- [x] Workflow JSON corrigé
- [x] Script d'import créé
- [x] Documentation de debug créée
- [ ] Script exécuté
- [ ] Workflow importé dans n8n
- [ ] Test manuel réussi
- [ ] Vérification Supabase
- [ ] Anciens workflows supprimés
- [ ] Workflow activé pour production

## Support

Si le problème persiste:

1. Vérifier les logs n8n: `tail -f ~/.n8n/logs/n8n.log`
2. Consulter le rapport détaillé: `DEBUG_REPORT.md`
3. Tester le node Supabase en isolation avec données mockées
4. Vérifier les credentials Supabase dans n8n (ID: Y37r8teOb0npvPKk)

## Documentation de référence

- n8n Supabase Node: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/
- n8n Community: https://community.n8n.io/
- Version n8n utilisée: 2.2.4

---

**Date de correction**: 2026-01-08
**Status**: PRÊT POUR IMPORT
