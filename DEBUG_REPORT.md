# Rapport de Debug - Insert to Supabase

**Workflow**: Philippineasy - Article Automation V2
**Node**: Insert to Supabase
**Erreur**: "Could not get parameter"
**Date**: 2026-01-08

---

## Analyse

### Catégorie
**Config** - Paramètres de configuration incorrects

### Symptôme
Le node "Insert to Supabase" génère l'erreur "Could not get parameter" lors de l'exécution. Le workflow s'arrête avant l'insertion des données dans la base de données.

### Cause directe
Utilisation du paramètre `dataMode: "autoMapInputData"` qui n'est pas supporté par la version actuelle du node Supabase dans n8n 2.2.4.

### Cause racine
Le paramètre `autoMapInputData` a été soit :
- Deprecated dans une version récente de n8n
- Jamais existé et créé par erreur lors de la génération du workflow
- Supporté uniquement dans une version future de n8n

La bonne syntaxe pour n8n 2.2.4 est `fieldsToSend: "defineBelow"` avec un mapping explicite via `fieldsUi.fieldValues`.

---

## Solution

### Configuration AVANT (incorrecte)

```json
{
  "parameters": {
    "operation": "insert",
    "tableId": "articles",
    "dataMode": "autoMapInputData",  // ❌ Non supporté
    "options": {}
  }
}
```

### Configuration APRÈS (correcte)

```json
{
  "parameters": {
    "operation": "insert",
    "tableId": "articles",
    "fieldsToSend": "defineBelow",  // ✅ Syntaxe correcte
    "fieldsUi": {
      "fieldValues": [
        {
          "fieldId": "title",
          "fieldValue": "={{ $json.title }}"
        },
        {
          "fieldId": "slug",
          "fieldValue": "={{ $json.slug }}"
        },
        {
          "fieldId": "content",
          "fieldValue": "={{ $json.content }}"
        },
        {
          "fieldId": "content_preview",
          "fieldValue": "={{ $json.content_preview }}"
        },
        {
          "fieldId": "category_id",
          "fieldValue": "={{ $json.category_id }}"
        },
        {
          "fieldId": "image",
          "fieldValue": "={{ $json.image }}"
        },
        {
          "fieldId": "status",
          "fieldValue": "={{ $json.status }}"
        },
        {
          "fieldId": "source",
          "fieldValue": "={{ $json.source }}"
        },
        {
          "fieldId": "source_url",
          "fieldValue": "={{ $json.source_url }}"
        },
        {
          "fieldId": "reading_time",
          "fieldValue": "={{ $json.reading_time }}"
        }
      ]
    },
    "options": {}
  }
}
```

### Mapping des champs

| Champ Supabase | Type | Source données |
|----------------|------|----------------|
| `title` | text | `$json.title` |
| `slug` | text | `$json.slug` |
| `content` | jsonb | `$json.content` (stringified) |
| `content_preview` | text | `$json.content_preview` |
| `category_id` | int | `$json.category_id` |
| `image` | text | `$json.image` |
| `status` | text | `$json.status` |
| `source` | text | `$json.source` |
| `source_url` | text | `$json.source_url` |
| `reading_time` | int | `$json.reading_time` |

---

## Validation des données d'entrée

### Données du node "Format Final Data"

```json
{
  "title": "Le guide complet de l'administration Marcos Jr. aux Philippines",
  "slug": "guide-complet-administration-marcos-jr-philippines",
  "content": "{\"time\":1767878418902,\"blocks\":[...]}",  // ✅ Stringified
  "content_preview": "Découvrez tout ce que vous devez savoir...",
  "category_id": 11,  // ✅ Integer
  "image": "https://placehold.co/1792x1024/1e40af/white?text=Philippineasy",
  "status": "draft",
  "source": "n8n",
  "source_url": "unknown",
  "reading_time": 5  // ✅ Integer
}
```

**Validation**: ✅ Toutes les données sont correctement formatées et correspondent au schéma Supabase.

---

## Prévention

### Pour éviter cette erreur à l'avenir

1. **Toujours vérifier la documentation officielle** n8n pour la version utilisée
2. **Tester les nodes Supabase** dans un workflow de test avant production
3. **Utiliser `fieldsToSend: "defineBelow"`** pour un contrôle total du mapping
4. **Éviter les paramètres "auto"** qui peuvent ne pas être supportés partout

### Bonnes pratiques Supabase node

```javascript
// ✅ CORRECT: Mapping explicite
{
  "fieldsToSend": "defineBelow",
  "fieldsUi": {
    "fieldValues": [
      { "fieldId": "column_name", "fieldValue": "={{ $json.field }}" }
    ]
  }
}

// ❌ INCORRECT: Auto-mapping non supporté
{
  "dataMode": "autoMapInputData"
}

// ⚠️ ALTERNATIF: Colonnes spécifiques (moins flexible)
{
  "columns": "title,slug,content",
  "fieldsUi": { ... }
}
```

---

## Checklist de déploiement

Avant d'activer le workflow:

- [x] Fichier JSON corrigé
- [ ] Workflow importé dans n8n
- [ ] Test manuel avec données mockées
- [ ] Vérification dans Supabase (insertion réussie)
- [ ] Suppression des anciens workflows doublons
- [ ] Activation du workflow
- [ ] Monitoring des premières exécutions

---

## Commandes d'exécution

```bash
# 1. Rendre le script exécutable
chmod +x "/Users/machugo/Documents/Philippineasy website 2026/fix-workflow.sh"

# 2. Exécuter le script de correction
bash "/Users/machugo/Documents/Philippineasy website 2026/fix-workflow.sh"

# 3. Vérifier l'import
n8n export:workflow --all | jq '.[] | select(.name == "Philippineasy - Article Automation V2") | {id, name, active}'

# 4. Tester manuellement (depuis l'UI n8n)
# http://localhost:5678/workflow/<ID>
```

---

## Références

- [n8n Supabase Node Documentation](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/)
- [n8n Community: Supabase Insert Issues](https://community.n8n.io/search?q=supabase%20insert)
- Schéma Supabase `articles` table (voir `/Users/machugo/Documents/Philippineasy website 2026/supabase/schema.sql`)

---

## Notes additionnelles

### Autres nodes Supabase dans le workflow

Le node "Save Error Log" utilise également Supabase et a été corrigé avec la même syntaxe:

```json
{
  "operation": "insert",
  "tableId": "n8n_logs",
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

### Impact sur la performance

Le mapping explicite n'a **aucun impact négatif** sur les performances. Au contraire:
- Meilleure traçabilité des données
- Détection d'erreurs plus précoce
- Flexibilité pour transformer les données

---

**Status**: ✅ CORRIGÉ
**Testé**: ⏳ EN ATTENTE
**Déployé**: ⏳ EN ATTENTE
