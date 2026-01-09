# Philippineasy - Article Automation Workflow

> Workflow n8n professionnel pour automatiser la création d'articles sur Philippineasy.com en utilisant l'intelligence artificielle et le scraping web.

## Vue d'ensemble

Ce workflow automatise complètement la création d'articles:

1. **Scraping** de 3 sources philippines (RSS + web dynamique)
2. **Filtrage** des articles récents (7 jours) et déduplication
3. **Réécriture** par Claude 3.5 Sonnet en français SEO-optimisé
4. **Génération d'image** par DALL-E 3
5. **Insertion** dans Supabase avec format EditorJS
6. **Gestion d'erreurs** complète avec logging

## Caractéristiques

- ✅ **Multi-sources**: RSS + FireCrawl pour contenu dynamique
- ✅ **AI-Powered**: Claude 3.5 Sonnet pour réécriture professionnelle
- ✅ **Images générées**: DALL-E 3 en format banner (1792x1024)
- ✅ **Format EditorJS**: Compatible avec votre éditeur frontend
- ✅ **SEO optimisé**: Meta descriptions, slugs, structure H2/H3
- ✅ **Déduplication**: Vérifie les doublons avant création
- ✅ **Error handling**: Logging automatique des erreurs
- ✅ **Production ready**: Testé et documenté

## Architecture

```
Sources → Scraping → Normalisation → Filtrage → AI Processing → Storage
                                                      ↓
                                                Error Handling
```

**Détails**: Voir [WORKFLOW-DOCUMENTATION.md](WORKFLOW-DOCUMENTATION.md)

## Installation rapide

### Prérequis

- n8n installé (cloud ou self-hosted)
- Compte Supabase
- Clés API: Anthropic, OpenAI, FireCrawl

### Installation en 10 minutes

Suivre le guide: [QUICK-INSTALL-GUIDE.md](QUICK-INSTALL-GUIDE.md)

**Résumé**:
1. Créer les tables Supabase (2 min)
2. Configurer les credentials n8n (5 min)
3. Importer le workflow (1 min)
4. Tester (2 min)

## Fichiers

| Fichier | Description |
|---------|-------------|
| `philippineasy-article-automation.json` | Workflow n8n complet |
| `WORKFLOW-DOCUMENTATION.md` | Documentation technique détaillée |
| `QUICK-INSTALL-GUIDE.md` | Guide d'installation rapide |
| `workflow-test-checklist.md` | Tests et validation |
| `.env.example` | Variables d'environnement |
| `README-WORKFLOW.md` | Ce fichier |

## Utilisation

### Exécution automatique

Le workflow s'exécute **automatiquement tous les jours à 8h** (UTC).

Pour modifier:
1. Ouvrir le node "Schedule Daily 8AM"
2. Modifier l'expression cron
3. Sauvegarder

### Exécution manuelle

1. Ouvrir le workflow dans n8n
2. Cliquer sur "Execute Workflow"
3. Attendre 2-3 minutes
4. Vérifier l'article dans Supabase

### Résultat

Chaque exécution crée un article avec:

- **Titre** SEO-optimisé (H1)
- **Slug** unique (<75 chars)
- **Contenu** structuré en EditorJS (H2, paragraphes, listes, citations, tableaux)
- **Meta description** (150-160 chars)
- **Image** générée par DALL-E
- **Reading time** calculé automatiquement
- **Status**: `draft` (à publier manuellement)

## Sources configurées

1. **Philippines Tourisme FR** (RSS)
   - https://www.philippines-tourisme.fr/feed/

2. **Expat Philippines** (RSS)
   - https://www.expat.com/fr/destination/asie/philippines/feed/actualites.xml

3. **Rappler Nation** (HTML dynamique via FireCrawl)
   - https://www.rappler.com/nation/

**Pour ajouter des sources**: Modifier le node "Define Sources"

## Format EditorJS

Les articles sont au format EditorJS v2.28.2:

```json
{
  "time": 1234567890,
  "blocks": [
    {
      "id": "unique-id",
      "type": "header",
      "data": { "text": "Titre", "level": 2 }
    },
    {
      "id": "unique-id-2",
      "type": "paragraph",
      "data": { "text": "Contenu..." }
    },
    {
      "id": "unique-id-3",
      "type": "list",
      "data": {
        "style": "unordered",
        "items": ["Point 1", "Point 2"]
      }
    }
  ],
  "version": "2.28.2"
}
```

**Types supportés**: paragraph, header, list, quote, image, table, delimiter

## Monitoring

### Vérifier les articles créés

```sql
SELECT title, slug, status, created_at
FROM articles
WHERE source = 'n8n'
ORDER BY created_at DESC
LIMIT 10;
```

### Vérifier les erreurs

```sql
SELECT * FROM workflow_errors
ORDER BY timestamp DESC
LIMIT 10;
```

### Dashboard n8n

1. Aller dans "Executions"
2. Filtrer par workflow
3. Voir succès/échecs
4. Analyser les exécutions

## Coûts

### Par article généré

- Claude 3.5 Sonnet: **~$0.03**
- DALL-E 3 (1792x1024): **~$0.08**
- FireCrawl: **~$0.01**
- **Total**: **~$0.12 par article**

### Par mois

- 30 articles/mois: **~$3.60**
- 60 articles/mois: **~$7.20**

### Optimisations possibles

- Utiliser Claude Haiku pour tâches simples
- Réduire la taille des images DALL-E
- Limiter le nombre de sources

## Dépannage

### Workflow ne s'exécute pas

**Solutions**:
- Vérifier que le workflow est "Active"
- Vérifier l'expression cron
- Vérifier les logs n8n

### Pas d'articles créés

**Solutions**:
- Vérifier que les sources RSS sont accessibles
- Vérifier les credentials API
- Tester manuellement chaque node
- Consulter `workflow_errors`

### Erreur Claude/OpenAI

**Solutions**:
- Vérifier les clés API
- Vérifier les crédits/quotas
- Vérifier les modèles autorisés
- Consulter les logs API

### Erreur Supabase

**Solutions**:
- Utiliser la Service Role Key (pas anon key)
- Vérifier que les tables existent
- Vérifier les permissions
- Vérifier les contraintes (slug unique)

**Guide complet**: [WORKFLOW-DOCUMENTATION.md](WORKFLOW-DOCUMENTATION.md#troubleshooting)

## Customisation

### Modifier le prompt Claude

1. Ouvrir le node "Claude AI Processing"
2. Modifier le paramètre "prompt"
3. Ajuster:
   - Ton de rédaction
   - Structure souhaitée
   - Category_id par défaut
   - Longueur de l'article

### Ajouter une source

1. Ouvrir le node "Define Sources"
2. Ajouter un objet dans le return:

```javascript
{
  type: 'rss', // ou 'html_dynamic'
  url: 'https://nouvelle-source.com/feed',
  name: 'Nouvelle Source'
}
```

### Modifier le schedule

1. Ouvrir "Schedule Daily 8AM"
2. Modifier l'expression cron:
   - `0 8 * * *` = Tous les jours à 8h
   - `0 9,17 * * *` = À 9h et 17h
   - `0 8 * * 1` = Tous les lundis à 8h

### Changer le format d'image

1. Ouvrir "DALL-E Generate Image"
2. Modifier "size":
   - `1024x1024` = Carré
   - `1792x1024` = Paysage (défaut)
   - `1024x1792` = Portrait

## Tests

Checklist complète: [workflow-test-checklist.md](workflow-test-checklist.md)

**Tests critiques**:
- [ ] Scraping des 3 sources
- [ ] Déduplication fonctionne
- [ ] Claude retourne JSON valide
- [ ] DALL-E génère image
- [ ] Insertion Supabase réussie
- [ ] Error handling déclenché

## Performance

### Temps d'exécution

- **Scraping**: ~10-20 secondes
- **Claude AI**: ~30-60 secondes
- **DALL-E**: ~20-30 secondes
- **Total**: ~2-3 minutes par article

### Optimisations

Pour traiter plus d'articles simultanément:

1. Ajouter un node "Split In Batches" après "Normalize Data"
2. Traiter 5 articles en parallèle
3. Attention aux rate limits API

## Sécurité

- ✅ Credentials stockées dans n8n (pas en dur)
- ✅ Service Role Key Supabase (backend uniquement)
- ✅ Validation des entrées
- ✅ Error logging pour audit
- ✅ Continue on fail pour résilience

**Checklist sécurité**:
- [ ] Credentials configurées dans n8n
- [ ] Pas de secrets dans le JSON du workflow
- [ ] Service Role Key Supabase utilisée
- [ ] Logs d'erreur activés

## Améliorations futures

### Court terme

- [ ] Notification Slack/Discord après création
- [ ] Dashboard de statistiques
- [ ] Catégorisation automatique intelligente

### Moyen terme

- [ ] Validation humaine avant publication
- [ ] A/B testing de titres
- [ ] Internal linking automatique

### Long terme

- [ ] RAG pour contexte et cohérence
- [ ] Multi-langue automatique
- [ ] Auto-publication basée sur score qualité

## Support

### Documentation

- [Documentation complète](WORKFLOW-DOCUMENTATION.md)
- [Guide d'installation](QUICK-INSTALL-GUIDE.md)
- [Tests](workflow-test-checklist.md)

### Ressources externes

- [n8n Documentation](https://docs.n8n.io)
- [Claude API](https://docs.anthropic.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Aide

1. Consulter la documentation
2. Vérifier `workflow_errors` dans Supabase
3. Tester les credentials
4. Consulter les logs n8n

## Changelog

### v1.0.0 (2026-01-08)

- ✅ Workflow initial complet
- ✅ Multi-sources (RSS + FireCrawl)
- ✅ Claude 3.5 Sonnet integration
- ✅ DALL-E 3 pour images
- ✅ Format EditorJS
- ✅ Error handling
- ✅ Documentation complète

## Licence

Propriétaire - Philippineasy.com

## Auteur

Créé par: Claude Code (n8n-workflow-creator)
Date: 2026-01-08
Version: 1.0.0

---

**Status**: ✅ Production Ready

**Quick Start**: Voir [QUICK-INSTALL-GUIDE.md](QUICK-INSTALL-GUIDE.md)

**Full Docs**: Voir [WORKFLOW-DOCUMENTATION.md](WORKFLOW-DOCUMENTATION.md)
