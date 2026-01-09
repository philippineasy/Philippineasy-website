#!/bin/bash

# Script de correction du workflow Philippineasy Article Automation V2
# Réimporte le workflow corrigé et supprime les doublons

set -e

WORKFLOW_FILE="/Users/machugo/Documents/Philippineasy website 2026/philippineasy-article-automation-v2.json"
WORKFLOW_NAME="Philippineasy - Article Automation V2"

echo "=================================================="
echo "  Fix workflow: Insert to Supabase"
echo "=================================================="
echo ""

# 1. Lister tous les workflows existants avec ce nom
echo "[1/4] Recherche des workflows existants..."
n8n export:workflow --all --output=/tmp/all-workflows.json 2>/dev/null || true

if [ -f "/tmp/all-workflows.json" ]; then
  EXISTING_IDS=$(jq -r ".[] | select(.name == \"$WORKFLOW_NAME\") | .id" /tmp/all-workflows.json)

  if [ -n "$EXISTING_IDS" ]; then
    echo "Workflows existants trouvés:"
    echo "$EXISTING_IDS" | while read id; do
      echo "  - ID: $id"
    done
    echo ""
  else
    echo "Aucun workflow existant trouvé."
    echo ""
  fi
fi

# 2. Import du workflow corrigé
echo "[2/4] Import du workflow corrigé..."
n8n import:workflow --input="$WORKFLOW_FILE"

if [ $? -eq 0 ]; then
  echo "✓ Workflow importé avec succès"
  echo ""
else
  echo "✗ Erreur lors de l'import"
  exit 1
fi

# 3. Vérifier l'import
echo "[3/4] Vérification de l'import..."
n8n export:workflow --all --output=/tmp/all-workflows-after.json 2>/dev/null

NEW_WORKFLOW=$(jq -r ".[] | select(.name == \"$WORKFLOW_NAME\") | {id, name, active}" /tmp/all-workflows-after.json | head -n 1)

if [ -n "$NEW_WORKFLOW" ]; then
  echo "Workflow importé:"
  echo "$NEW_WORKFLOW"
  echo ""
else
  echo "✗ Impossible de vérifier l'import"
  exit 1
fi

# 4. Supprimer les anciens doublons (optionnel)
echo "[4/4] Gestion des doublons..."

if [ -f "/tmp/all-workflows.json" ] && [ -n "$EXISTING_IDS" ]; then
  echo "Doublons détectés. Pour les supprimer manuellement:"
  echo ""
  echo "$EXISTING_IDS" | while read id; do
    echo "  n8n update:workflow --id=$id --active=false"
    echo "  # Puis supprimer depuis l'UI n8n"
  done
  echo ""
  echo "Note: La suppression via CLI n'est pas disponible dans n8n."
  echo "Désactivez et supprimez les anciens workflows depuis l'interface web."
else
  echo "Aucun doublon à gérer."
fi

echo ""
echo "=================================================="
echo "  Résumé"
echo "=================================================="
echo ""
echo "✓ Workflow corrigé importé"
echo "✓ Node 'Insert to Supabase' utilise maintenant:"
echo "    - fieldsToSend: 'defineBelow'"
echo "    - fieldsUi avec mapping explicite de tous les champs"
echo ""
echo "Prochaines étapes:"
echo "1. Ouvrir n8n: http://localhost:5678"
echo "2. Tester le workflow manuellement"
echo "3. Vérifier le node 'Insert to Supabase'"
echo "4. Supprimer les anciens workflows doublons si nécessaire"
echo ""

# Cleanup
rm -f /tmp/all-workflows.json /tmp/all-workflows-after.json

exit 0
