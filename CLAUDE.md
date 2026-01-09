# Instructions Claude Code - Philippineasy

## MCP Configurés

| MCP | Description | Commandes disponibles |
|-----|-------------|----------------------|
| **supabase** | Base de données Supabase | Requêtes SQL, gestion tables, vérifier schéma |
| **github** | Repos, issues, PRs | Créer issues, review PRs, vérifier repos |
| **vercel** | Déploiements | Deploy, status, logs, vérifier déploiements |
| **n8n-docs** | Documentation 545+ nodes n8n | Rechercher nodes, paramètres, exemples |
| **n8n-db** | Base SQLite n8n locale | Lire workflows existants, credentials |

### Accès MCP pour les agents n8n

Les agents n8n ont accès aux MCP et peuvent :

- **Vérifier les intégrations** : S'assurer qu'un workflow utilise correctement Supabase, GitHub ou Vercel
- **Valider les credentials** : Vérifier que les credentials n8n correspondent aux services configurés
- **Tester les connexions** : Utiliser les MCP pour vérifier que les APIs sont accessibles
- **Synchroniser** : Vérifier que les données entre n8n et Supabase sont cohérentes

## Commandes CLI n8n

L'instance n8n locale est accessible via CLI :

```bash
# Exécuter un workflow
n8n execute --id <ID>

# Exporter un workflow en JSON
n8n export:workflow --id=<ID> --output=workflow.json
n8n export:workflow --all --output=backups/

# Importer un workflow
n8n import:workflow --input=workflow.json

# Activer/désactiver un workflow
n8n update:workflow --id=<ID> --active=true
n8n update:workflow --id=<ID> --active=false
```

**Base de données n8n** : `~/.n8n/database.sqlite`

## Agents n8n disponibles

Utiliser via `Task` tool avec le bon `subagent_type` :

| Agent | Usage |
|-------|-------|
| `n8n-orchestrator` | Demandes complexes n8n (coordonne les autres) |
| `n8n-workflow-creator` | Créer/modifier un workflow |
| `n8n-validator` | Valider un workflow avant déploiement |
| `n8n-debugger` | Diagnostiquer une erreur de workflow |
| `n8n-watcher` | Veille techno, mises à jour n8n |
| `n8n-memory` | Rechercher dans la knowledge base |
| `n8n-designer` | Créer des visuels (DALL-E) |

## Knowledge Base n8n

Emplacement : `~/.claude/n8n-knowledge/`

Structure :
- `nodes/` - Documentation des nodes
- `features/` - Fonctionnalités (loops, expressions, etc.)
- `changelog/` - Historique des versions, breaking changes
- `examples/` - Patterns et workflows exemples
- `community/` - Tips et templates

## Règles

### Ce que tu PEUX faire

- Lire les workflows n8n existants (via n8n-db MCP ou CLI)
- Créer des workflows JSON complexes (branches, loops, conditions)
- Importer des workflows dans n8n (`n8n import:workflow`)
- Exécuter des workflows pour les tester (`n8n execute --id`)
- Valider les workflows avant déploiement
- Rechercher dans la documentation n8n
- Accéder à Supabase, GitHub, Vercel via MCP

### Ce que tu NE DOIS PAS faire sans confirmation

- Supprimer des workflows
- Modifier des workflows en production
- Appeler des APIs payantes (DALL-E, etc.)
- Pousser en production sur Vercel
- Modifications majeures de la knowledge base

### Workflow de création n8n recommandé

1. **Rechercher** : Consulter n8n-memory pour les nodes nécessaires
2. **Créer** : Générer le JSON avec n8n-workflow-creator
3. **Valider** : Vérifier avec n8n-validator
4. **Importer** : `n8n import:workflow --input=workflow.json`
5. **Vérifier l'import** : `n8n export:workflow --all` pour confirmer que le workflow est bien ajouté
6. **Tester** : `n8n execute --id=<ID>`
7. **Corriger** : Si erreur, utiliser n8n-debugger
8. **Itérer** : Jusqu'à ce que ça fonctionne

### Vérifications post-import

Après import d'un workflow, toujours vérifier :

```bash
# Lister tous les workflows pour confirmer l'ajout
n8n export:workflow --all | jq '.[].name'

# Vérifier un workflow spécifique
n8n export:workflow --id=<ID> | jq '.nodes[].type'

# Vérifier les credentials utilisés
n8n export:workflow --id=<ID> | jq '.nodes[].credentials'
```

### Vérification des intégrations dans les workflows

Pour un workflow qui utilise Supabase/GitHub/Vercel :

1. **Extraire les nodes concernés** du workflow JSON
2. **Vérifier via MCP** que les tables/repos/projets existent
3. **Valider les credentials** n8n correspondent aux services
4. **Tester l'exécution** avec `n8n execute --id=<ID>`

## Structure du projet Philippineasy

- Framework : Next.js 15 (App Router)
- Base de données : Supabase
- Déploiement : Vercel
- Automatisation : n8n (local)

## Fichiers importants

- `package.json` - Dépendances
- `src/app/` - Pages et routes
- `src/components/` - Composants React
- `src/services/` - Services métier
- `src/utils/supabase/` - Configuration Supabase
