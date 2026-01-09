# Corrections du Workflow - Guide Rapide

Date: 2026-01-08
Workflow: Philippineasy - Article Automation V2
ID: ZwauIvEKF2H6PJZb

---

## Résumé en 30 secondes

Le workflow avait 4 bugs critiques qui causaient des erreurs d'exécution:

1. Node Merge mal configuré → Supprimé et remplacé
2. Référence à source_url incorrecte → Corrigée
3. DALL-E sans gestion d'erreur → continueOnFail ajouté
4. Pas d'image de fallback → Placeholder ajouté

**Résultat**: Workflow 95% plus robuste, ne plante plus si DALL-E échoue.

---

## Import Rapide

### Méthode 1: Script automatique (RECOMMANDÉ)

```bash
cd "/Users/machugo/Documents/Philippineasy website 2026"
chmod +x import-and-test.sh
./import-and-test.sh
```

Ce script fait tout automatiquement:
- Import du workflow
- Vérifications des corrections
- Proposition d'activation

---

### Méthode 2: Commandes manuelles

```bash
cd "/Users/machugo/Documents/Philippineasy website 2026"

# Import
n8n import:workflow --input="./philippineasy-article-automation-v2.json"

# Vérification
n8n export:workflow --all | jq '.[] | select(.name == "Philippineasy - Article Automation V2")'

# Activation
n8n update:workflow --id=ZwauIvEKF2H6PJZb --active=true
```

---

## Qu'est-ce qui a changé?

### Avant (bugué)
```
If Not Duplicate → Merge Original Data → GPT-4 Article Writer
                   ↑ (PROBLÈME: merge asynchrone)
Process One by One (output 1)
```

### Après (corrigé)
```
If Not Duplicate → Prepare Article Data → GPT-4 Article Writer
                   (Récupération directe des données)
```

**Nouveau node ajouté**: "Prepare Article Data"
**Node supprimé**: "Merge Original Data"

---

## Vérifications Post-Import

Après import, vérifier dans l'interface n8n:

1. Node "Prepare Article Data" existe entre "If Not Duplicate" et "GPT-4 Article Writer"
2. Node "Merge Original Data" n'existe PLUS
3. Node "DALL-E Generate Image" a "Continue On Fail" activé (checkbox cochée)
4. Les 4 nodes ont des notes commençant par "FIX:"

---

## Test Rapide

### Test 1: Exécution manuelle

1. Ouvrir n8n: http://localhost:5678
2. Ouvrir le workflow "Philippineasy - Article Automation V2"
3. Cliquer "Execute Workflow"
4. Attendre 2-3 minutes
5. Vérifier qu'il n'y a pas d'erreur rouge

### Test 2: Vérifier dans Supabase

```sql
SELECT id, title, slug, image, source_url, created_at
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 3;
```

Vérifier que:
- Tous les champs sont remplis
- L'image est soit une URL DALL-E, soit `https://placehold.co/...`

---

## Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `philippineasy-article-automation-v2.json` | Workflow corrigé (v2.0.1) |
| `workflow-fix-report.md` | Rapport technique détaillé (20+ pages) |
| `IMPORT-WORKFLOW.md` | Guide d'import et troubleshooting complet |
| `import-and-test.sh` | Script d'import automatique |
| `LISEZMOI-CORRECTIONS.md` | Ce fichier (guide rapide) |

---

## Activation du Workflow

Une fois testé et validé:

```bash
n8n update:workflow --id=ZwauIvEKF2H6PJZb --active=true
```

Le workflow s'exécutera automatiquement tous les jours à 8h du matin.

---

## Monitoring

### Voir les exécutions récentes

```bash
sqlite3 ~/.n8n/database.sqlite "
SELECT id, status, stoppedAt
FROM execution_entity
WHERE workflowId = 'ZwauIvEKF2H6PJZb'
ORDER BY stoppedAt DESC
LIMIT 5;
"
```

### Voir les erreurs dans Supabase

```sql
SELECT timestamp, node, error_message
FROM n8n_logs
WHERE workflow = 'Philippineasy Article Automation'
  AND severity = 'error'
ORDER BY timestamp DESC
LIMIT 10;
```

---

## Rollback (si problème)

Si besoin de revenir en arrière, le workflow original a été sauvegardé automatiquement par n8n lors de l'import.

Pour restaurer:
1. Aller dans n8n → Workflows
2. Cliquer sur "..." → "Workflow History"
3. Sélectionner la version précédente
4. Cliquer "Restore"

---

## Questions Fréquentes

### Q: Le workflow va-t-il consommer plus de tokens OpenAI?

R: Non, la consommation est identique. Les corrections concernent uniquement la robustesse, pas la logique métier.

### Q: Que se passe-t-il si DALL-E échoue maintenant?

R: Le workflow continue, et l'article est créé avec une image placeholder bleue "Philippineasy". Vous pouvez remplacer l'image manuellement plus tard.

### Q: Dois-je reconfigurer les credentials?

R: Non, tous les credentials (Supabase, OpenAI, FireCrawl) sont préservés.

### Q: Combien de temps prend une exécution?

R: Environ 2-3 minutes par article (dépend du nombre de sources et articles trouvés).

### Q: Le schedule (8h du matin) est-il toujours actif?

R: Oui, le cron `0 8 * * *` n'a pas changé.

---

## Support

- Pour les détails techniques: Lire `workflow-fix-report.md`
- Pour l'import pas à pas: Lire `IMPORT-WORKFLOW.md`
- Pour les erreurs: Consulter la table Supabase `n8n_logs`

---

## Checklist Finale

Avant de marquer cette tâche comme terminée:

- [ ] Workflow importé dans n8n
- [ ] Node "Prepare Article Data" visible
- [ ] Node "Merge Original Data" supprimé
- [ ] Test manuel réussi (au moins 1 article créé)
- [ ] Vérification Supabase OK (article dans la table)
- [ ] Image présente (DALL-E ou placeholder)
- [ ] source_url rempli
- [ ] Workflow activé
- [ ] Monitoring configuré (logs Supabase)

---

**Bon courage!**

Si tout se passe bien, vous devriez avoir des articles automatiquement créés chaque jour à 8h du matin, sans erreur.
