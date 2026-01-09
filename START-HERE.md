# 🚀 Philippineasy - Article Automation
## START HERE - Démarrage rapide

> Automatise la création d'articles pour Philippineasy.com avec IA et scraping web

---

## ⚡ Installation en 3 minutes

### 1. Prérequis (2 min)

Obtenir ces clés API:

- **Supabase**: Service Role Key depuis https://app.supabase.com
- **Anthropic**: API Key depuis https://console.anthropic.com
- **OpenAI**: API Key depuis https://platform.openai.com
- **FireCrawl**: API Key depuis https://firecrawl.dev

### 2. Installation (1 min)

```bash
# 1. Créer les tables dans Supabase
# Copier/coller le SQL depuis supabase-queries.sql (section 1)

# 2. Dans n8n:
# - Importer philippineasy-article-automation.json
# - Configurer les 4 credentials (Supabase, Anthropic, OpenAI, FireCrawl)
# - Activer le workflow

# 3. Tester
# Cliquer sur "Execute Workflow" → Vérifier l'article créé dans Supabase
```

✅ **C'est fait!** Le workflow s'exécutera automatiquement tous les jours à 8h.

---

## 📋 Ce que fait le workflow

```
Sources Philippines → Scraping → IA (Claude) → Image (DALL-E) → Supabase
                                      ↓
                                 Article SEO
```

**Résultat**: 1 article/jour au format EditorJS, optimisé SEO, avec image générée

---

## 📚 Documentation

### Pour les pressés (vous êtes ici)
- **START-HERE.md** ← Vous êtes ici (3 min)

### Pour installation complète
- **QUICK-INSTALL-GUIDE.md** (10 min)
- **pre-flight-check.md** (checklist avant activation)

### Pour comprendre en détail
- **README-WORKFLOW.md** (vue d'ensemble)
- **WORKFLOW-DOCUMENTATION.md** (documentation complète)

### Pour tester et maintenir
- **workflow-test-checklist.md** (tests)
- **supabase-queries.sql** (monitoring)
- **example-editorjs-output.json** (exemples)

### Pour naviguer
- **WORKFLOW-INDEX.md** (index de tous les fichiers)

---

## 🎯 Que lire selon votre besoin?

| Je veux... | Lire... | Temps |
|-----------|---------|-------|
| Installer vite | QUICK-INSTALL-GUIDE.md | 10 min |
| Tout comprendre | WORKFLOW-DOCUMENTATION.md | 45 min |
| Tester | workflow-test-checklist.md | 30 min |
| Monitorer | supabase-queries.sql | 15 min |
| Naviguer | WORKFLOW-INDEX.md | 5 min |

---

## 💰 Coûts

- **Par article**: ~$0.12
- **Par mois (30 articles)**: ~$3.60
- **Services**: Anthropic + OpenAI + FireCrawl

---

## 🔧 Support rapide

### Workflow ne marche pas?
1. Vérifier les credentials dans n8n
2. Consulter table `workflow_errors` dans Supabase
3. Lire section Troubleshooting de WORKFLOW-DOCUMENTATION.md

### Pas d'articles créés?
1. Vérifier que workflow est "Active"
2. Tester manuellement avec "Execute Workflow"
3. Vérifier les sources RSS sont accessibles

### Erreur API?
1. Vérifier clés API valides
2. Vérifier crédits disponibles
3. Consulter logs de l'API concernée

---

## ✅ Checklist rapide

Avant d'activer:

- [ ] Tables Supabase créées
- [ ] 4 credentials configurées dans n8n
- [ ] Workflow importé
- [ ] Test manuel réussi
- [ ] Article visible dans Supabase

Après activation:

- [ ] Vérifier exécution le lendemain
- [ ] Surveiller les coûts API
- [ ] Consulter workflow_errors régulièrement

---

## 📊 Fichiers du projet

```
📁 Workflow Philippineasy/
├── 📄 START-HERE.md                          ← Vous êtes ici
├── 📄 QUICK-INSTALL-GUIDE.md                 Installation 10 min
├── 📄 README-WORKFLOW.md                      Vue d'ensemble
├── 📄 WORKFLOW-DOCUMENTATION.md               Doc complète
├── 📄 WORKFLOW-INDEX.md                       Index navigation
├── 📄 workflow-test-checklist.md              Tests
├── 📄 pre-flight-check.md                     Checklist activation
├── 📄 supabase-queries.sql                    SQL utiles
├── 📄 example-editorjs-output.json            Exemples
├── 📄 .env.example                            Variables
└── 📄 philippineasy-article-automation.json   Workflow n8n
```

---

## 🎓 Prochaines étapes

### Maintenant
1. ✅ Lire ce fichier (done!)
2. → Aller à **QUICK-INSTALL-GUIDE.md**
3. → Installer le workflow
4. → Tester

### Plus tard
- Lire WORKFLOW-DOCUMENTATION.md
- Personnaliser le prompt Claude
- Ajouter des sources
- Optimiser les coûts

---

## 🌟 Fonctionnalités

- ✅ Multi-sources (RSS + scraping dynamique)
- ✅ Réécriture IA (Claude 3.5 Sonnet)
- ✅ Images générées (DALL-E 3)
- ✅ Format EditorJS
- ✅ SEO optimisé
- ✅ Déduplication automatique
- ✅ Error handling complet
- ✅ Production ready

---

## 📞 Besoin d'aide?

**Installation**: QUICK-INSTALL-GUIDE.md
**Problème technique**: WORKFLOW-DOCUMENTATION.md → Troubleshooting
**Tests**: workflow-test-checklist.md
**SQL**: supabase-queries.sql

---

**Version**: 1.0.0
**Date**: 8 janvier 2026
**Status**: ✅ Production Ready

---

**→ Prochaine étape: [QUICK-INSTALL-GUIDE.md](QUICK-INSTALL-GUIDE.md)**
