# Pre-Flight Check - Workflow Philippineasy

## Vérification avant activation du workflow

Utilisez cette checklist pour vous assurer que tout est correctement configuré avant d'activer le workflow en production.

---

## 1. SUPABASE

### Tables créées
- [ ] Table `articles` existe
- [ ] Table `workflow_errors` existe
- [ ] Tous les index créés
- [ ] Trigger `update_updated_at_column` fonctionne

**Test SQL**:
```sql
-- Vérifier les tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('articles', 'workflow_errors');

-- Doit retourner 2 lignes
```

### Credentials
- [ ] Service Role Key obtenue (pas anon key)
- [ ] URL Supabase correcte: `https://[PROJECT].supabase.co`
- [ ] Connection testée

**Test**:
```bash
# Tester la connection avec curl
curl https://YOUR_PROJECT.supabase.co/rest/v1/articles \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# Doit retourner un array JSON (peut être vide)
```

---

## 2. ANTHROPIC (Claude)

### API Key
- [ ] Clé API créée sur https://console.anthropic.com
- [ ] Format: `sk-ant-api03-...`
- [ ] Crédits disponibles ($5+ recommandé)

**Test**:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# Doit retourner une réponse JSON avec "content"
```

### Billing
- [ ] Billing alert configuré
- [ ] Budget mensuel défini
- [ ] Méthode de paiement valide

**Coût estimé**: ~$0.03 par article = ~$0.90/mois (30 articles)

---

## 3. OPENAI (DALL-E)

### API Key
- [ ] Clé API créée sur https://platform.openai.com
- [ ] Format: `sk-proj-...` ou `sk-...`
- [ ] Crédits disponibles ($5+ recommandé)
- [ ] Accès DALL-E 3 confirmé

**Test**:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"

# Chercher "dall-e-3" dans la liste
```

### Billing
- [ ] Billing alert configuré
- [ ] Budget mensuel défini
- [ ] Méthode de paiement valide

**Coût estimé**: ~$0.08 par image = ~$2.40/mois (30 images)

---

## 4. FIRECRAWL

### API Key
- [ ] Compte créé sur https://firecrawl.dev
- [ ] Clé API obtenue
- [ ] Format: `fc-...`
- [ ] Plan gratuit ou payant activé

**Test**:
```bash
curl -X POST https://api.firecrawl.dev/v0/scrape \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.rappler.com/nation/",
    "formats": ["markdown"],
    "onlyMainContent": true
  }'

# Doit retourner du contenu markdown
```

### Quotas
- [ ] Quotas mensuels vérifiés
- [ ] Plan adapté au volume (1 scrape/jour minimum)

**Coût estimé**: Plan gratuit ou ~$10/mois

---

## 5. N8N

### Installation
- [ ] n8n version ≥ 1.0 (2.x recommandé)
- [ ] Accessible via interface web
- [ ] Credentials fonctionnent

**Vérifier version**:
```bash
# Si self-hosted
n8n --version

# Ou dans l'interface: Settings > About
```

### Credentials configurées
- [ ] **Anthropic**: Type "Anthropic API", clé valide
- [ ] **OpenAI**: Type "OpenAI API", clé valide
- [ ] **FireCrawl**: Type "HTTP Header Auth", clé valide
- [ ] **Supabase**: Type "Supabase", URL + Service Key

**Test dans n8n**:
1. Créer un workflow test
2. Ajouter un node avec credential
3. Tester la connection
4. Vérifier le résultat

---

## 6. SOURCES

### RSS Feeds accessibles
- [ ] https://www.philippines-tourisme.fr/feed/ (200 OK)
- [ ] https://www.expat.com/fr/destination/asie/philippines/feed/actualites.xml (200 OK)

**Test**:
```bash
curl -I https://www.philippines-tourisme.fr/feed/
curl -I https://www.expat.com/fr/destination/asie/philippines/feed/actualites.xml

# Vérifier: HTTP/1.1 200 OK
```

### Site dynamique
- [ ] https://www.rappler.com/nation/ accessible

**Test**:
```bash
curl -I https://www.rappler.com/nation/

# Vérifier: HTTP/1.1 200 OK
```

---

## 7. WORKFLOW

### Import réussi
- [ ] Fichier `philippineasy-article-automation.json` importé
- [ ] Tous les nodes visibles
- [ ] Pas d'erreurs d'import

### Credentials assignées
Vérifier chaque node:

- [ ] **Define Sources**: Pas de credential (Code node)
- [ ] **Switch by Type**: Pas de credential
- [ ] **RSS Feed Read**: Pas de credential
- [ ] **FireCrawl Scrape**: Credential HTTP/FireCrawl
- [ ] **Merge All Sources**: Pas de credential
- [ ] **Normalize Data**: Pas de credential (Code node)
- [ ] **Filter Last 7 Days**: Pas de credential
- [ ] **Check Duplicate in Supabase**: Credential Supabase
- [ ] **If Not Duplicate**: Pas de credential
- [ ] **Claude AI Processing**: Credential Anthropic
- [ ] **Parse AI Response**: Pas de credential (Code node)
- [ ] **DALL-E Generate Image**: Credential OpenAI
- [ ] **Format Final Data**: Pas de credential (Code node)
- [ ] **Insert to Supabase**: Credential Supabase
- [ ] **Success Notification**: Pas de credential (Code node)
- [ ] **Error Trigger**: Pas de credential
- [ ] **Log Error**: Pas de credential (Code node)
- [ ] **Save Error to DB**: Credential Supabase

### Connections vérifiées
- [ ] Toutes les flèches connectent les bons nodes
- [ ] Pas de nodes orphelins
- [ ] Error workflow connecté

---

## 8. TEST MANUEL

### Exécution test
- [ ] Cliquer sur "Execute Workflow"
- [ ] Attendre fin d'exécution (2-5 min)
- [ ] Tous les nodes en vert ✅

### Vérification résultat
- [ ] Article créé dans Supabase
- [ ] Champs remplis correctement
- [ ] Image URL présente
- [ ] Content au format EditorJS valide
- [ ] Slug unique et correct

**Query de vérification**:
```sql
SELECT
  title,
  slug,
  status,
  reading_time,
  image,
  created_at
FROM articles
ORDER BY created_at DESC
LIMIT 1;
```

### Test doublon
- [ ] Exécuter workflow une 2e fois
- [ ] Vérifier qu'article identique filtré
- [ ] Pas de doublon dans `articles`

### Test error handling
- [ ] Désactiver temporairement une credential
- [ ] Exécuter workflow
- [ ] Vérifier Error Trigger activé
- [ ] Vérifier erreur dans `workflow_errors`
- [ ] Réactiver credential

---

## 9. CONFIGURATION

### Schedule
- [ ] Cron expression correcte: `0 8 * * *`
- [ ] Timezone appropriée (UTC par défaut)
- [ ] Adapté si besoin

**Tester le cron**:
Utiliser https://crontab.guru pour vérifier l'expression.

### Prompt Claude
- [ ] Prompt complet dans "Claude AI Processing"
- [ ] Category_id correct (11)
- [ ] Ton adapté
- [ ] Format JSON bien défini

### Sources
- [ ] 3 sources dans "Define Sources"
- [ ] URLs correctes
- [ ] Types corrects (rss, html_dynamic)

---

## 10. MONITORING

### Logs n8n
- [ ] Executions sauvegardées
- [ ] Logs accessibles
- [ ] Pas d'erreurs critiques

**Configuration**:
```
Settings > Log Streaming
ou
Settings > Executions
```

### Supabase
- [ ] Table `workflow_errors` pour logging
- [ ] Queries SQL préparées (voir supabase-queries.sql)

### Billing Alerts
- [ ] **Anthropic**: Alert à $5 configuré
- [ ] **OpenAI**: Alert à $5 configuré
- [ ] **FireCrawl**: Plan surveillé

---

## 11. DOCUMENTATION

### Fichiers présents
- [ ] `philippineasy-article-automation.json`
- [ ] `WORKFLOW-DOCUMENTATION.md`
- [ ] `QUICK-INSTALL-GUIDE.md`
- [ ] `workflow-test-checklist.md`
- [ ] `README-WORKFLOW.md`
- [ ] `example-editorjs-output.json`
- [ ] `supabase-queries.sql`
- [ ] `.env.example`
- [ ] `pre-flight-check.md` (ce fichier)

### Documentation lue
- [ ] README-WORKFLOW.md parcouru
- [ ] QUICK-INSTALL-GUIDE.md suivi
- [ ] Troubleshooting connu

---

## 12. SÉCURITÉ

### Credentials
- [ ] Jamais de clés API en dur dans le workflow
- [ ] Tout dans n8n Credentials
- [ ] Service Role Key (pas anon key) pour Supabase

### Accès
- [ ] Workflow accessible uniquement aux admins
- [ ] n8n protégé par authentification
- [ ] Pas de webhook public non sécurisé

### Données
- [ ] Pas de données sensibles dans les articles
- [ ] Source URLs publiques uniquement
- [ ] Respect des licences de contenu

---

## 13. PERFORMANCE

### Limites testées
- [ ] Workflow fonctionne avec 1 article
- [ ] Workflow fonctionne avec 5+ articles
- [ ] Pas de timeout (<10 min total)

### Rate Limits
- [ ] Anthropic: 50 requests/min (largement suffisant)
- [ ] OpenAI: 5 images/min (suffisant)
- [ ] FireCrawl: selon plan

---

## 14. ACTIVATION

### Pre-activation
- [ ] Tous les checks précédents validés ✅
- [ ] Test manuel réussi
- [ ] Error handling testé
- [ ] Documentation à jour

### Activation
- [ ] Workflow activé (toggle "Active")
- [ ] Schedule vérifié
- [ ] Première exécution planifiée (lendemain 8h)

### Post-activation
- [ ] Vérifier exécution automatique le lendemain
- [ ] Surveiller les logs
- [ ] Vérifier les coûts API

---

## CHECKLIST FINALE

### Avant d'activer en production

- [ ] ✅ Toutes les sections 1-13 validées
- [ ] ✅ Test manuel réussi
- [ ] ✅ Article test visible dans Supabase
- [ ] ✅ Error handling fonctionne
- [ ] ✅ Credentials sécurisées
- [ ] ✅ Billing alerts configurés
- [ ] ✅ Documentation accessible
- [ ] ✅ Équipe informée
- [ ] ✅ Plan de rollback préparé

### Si une checkbox n'est pas cochée
**STOP** - Ne pas activer le workflow
Consulter la section correspondante et corriger le problème.

---

## ROLLBACK PLAN

En cas de problème après activation:

1. **Désactiver immédiatement**:
   - Toggle "Active" à OFF dans n8n

2. **Identifier le problème**:
   - Consulter `workflow_errors`
   - Vérifier les logs n8n
   - Vérifier les coûts API

3. **Corriger**:
   - Modifier le workflow
   - Tester manuellement
   - Refaire les checks

4. **Réactiver prudemment**:
   - Test manuel avant
   - Surveiller la première exécution auto
   - Vérifier les résultats

---

## CONTACT & SUPPORT

### Ressources
- Documentation: `WORKFLOW-DOCUMENTATION.md`
- Tests: `workflow-test-checklist.md`
- SQL: `supabase-queries.sql`

### APIs
- Anthropic: https://docs.anthropic.com
- OpenAI: https://platform.openai.com/docs
- FireCrawl: https://firecrawl.dev/docs
- Supabase: https://supabase.com/docs
- n8n: https://docs.n8n.io

---

## RÉSUMÉ

**Status**: [ ] Prêt pour production

**Dernière vérification**: [Date]

**Vérifié par**: [Nom]

**Notes**:
```
[Ajouter ici toute note importante ou point d'attention]
```

---

**Bonne chance avec votre workflow Philippineasy! 🇵🇭**

Si tous les checks sont validés, vous êtes prêt à automatiser la création de contenu de qualité pour votre site.
