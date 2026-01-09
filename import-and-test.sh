#!/bin/bash

# Script d'import et test du workflow Philippineasy Article Automation V2
# Date: 2026-01-08
# Version: 1.0

set -e  # Exit on error

# Couleurs pour output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fichiers
WORKFLOW_FILE="./philippineasy-article-automation-v2.json"
WORKFLOW_ID="ZwauIvEKF2H6PJZb"
REPORT_FILE="workflow-fix-report.md"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Import Workflow Philippineasy V2${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Vérifier que le fichier existe
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}Erreur: Fichier $WORKFLOW_FILE introuvable${NC}"
    exit 1
fi

echo -e "${YELLOW}Fichier trouvé: $WORKFLOW_FILE${NC}"
echo ""

# Vérifier la version dans le JSON
VERSION=$(jq -r '.versionId' "$WORKFLOW_FILE")
echo -e "${YELLOW}Version du workflow: $VERSION${NC}"

if [ "$VERSION" != "2.0.1" ]; then
    echo -e "${RED}Attention: Version attendue 2.0.1, trouvée $VERSION${NC}"
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}Étape 1/5: Import du workflow${NC}"
echo -e "${YELLOW}Commande: n8n import:workflow --input=\"$WORKFLOW_FILE\"${NC}"
echo ""

# Importer le workflow
if n8n import:workflow --input="$WORKFLOW_FILE"; then
    echo -e "${GREEN}✓ Import réussi${NC}"
else
    echo -e "${RED}✗ Échec de l'import${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Étape 2/5: Vérification de l'import${NC}"
echo ""

# Vérifier que le workflow existe
if n8n export:workflow --all | jq -e '.[] | select(.name == "Philippineasy - Article Automation V2")' > /dev/null; then
    echo -e "${GREEN}✓ Workflow trouvé dans n8n${NC}"

    # Afficher les infos du workflow
    echo ""
    echo -e "${YELLOW}Informations du workflow:${NC}"
    n8n export:workflow --all | jq '.[] | select(.name == "Philippineasy - Article Automation V2") | {name, id, versionId, active}'
else
    echo -e "${RED}✗ Workflow introuvable après import${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Étape 3/5: Vérification des nodes critiques${NC}"
echo ""

# Exporter le workflow importé pour vérifier
IMPORTED_WORKFLOW=$(n8n export:workflow --id="$WORKFLOW_ID")

# Vérifier que les nodes fixés existent
echo -e "${YELLOW}Vérification des corrections:${NC}"

# Node "Prepare Article Data" doit exister
if echo "$IMPORTED_WORKFLOW" | jq -e '.nodes[] | select(.name == "Prepare Article Data")' > /dev/null; then
    echo -e "${GREEN}✓ Node 'Prepare Article Data' présent${NC}"
else
    echo -e "${RED}✗ Node 'Prepare Article Data' manquant${NC}"
fi

# Node "Merge Original Data" NE DOIT PAS exister
if echo "$IMPORTED_WORKFLOW" | jq -e '.nodes[] | select(.name == "Merge Original Data")' > /dev/null; then
    echo -e "${RED}✗ Node 'Merge Original Data' encore présent (devrait être supprimé)${NC}"
else
    echo -e "${GREEN}✓ Node 'Merge Original Data' correctement supprimé${NC}"
fi

# DALL-E doit avoir continueOnFail
DALLE_CONTINUE=$(echo "$IMPORTED_WORKFLOW" | jq -r '.nodes[] | select(.name == "DALL-E Generate Image") | .continueOnFail')
if [ "$DALLE_CONTINUE" = "true" ]; then
    echo -e "${GREEN}✓ DALL-E a 'continueOnFail' activé${NC}"
else
    echo -e "${RED}✗ DALL-E n'a pas 'continueOnFail' activé${NC}"
fi

# Format Final Data doit contenir le fallback
if echo "$IMPORTED_WORKFLOW" | jq -r '.nodes[] | select(.name == "Format Final Data") | .parameters.jsCode' | grep -q "placehold.co"; then
    echo -e "${GREEN}✓ Fallback image présent dans 'Format Final Data'${NC}"
else
    echo -e "${RED}✗ Fallback image manquant${NC}"
fi

echo ""
echo -e "${GREEN}Étape 4/5: Compter les nodes${NC}"
echo ""

NODE_COUNT=$(echo "$IMPORTED_WORKFLOW" | jq '.nodes | length')
echo -e "${YELLOW}Nombre de nodes: $NODE_COUNT${NC}"

if [ "$NODE_COUNT" -eq 20 ]; then
    echo -e "${GREEN}✓ Nombre de nodes correct (20)${NC}"
else
    echo -e "${YELLOW}⚠ Nombre de nodes inattendu (attendu: 20, trouvé: $NODE_COUNT)${NC}"
fi

echo ""
echo -e "${GREEN}Étape 5/5: Résumé${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Import terminé avec succès!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo ""
echo "1. Tester manuellement le workflow dans n8n:"
echo "   - Ouvrir http://localhost:5678"
echo "   - Sélectionner 'Philippineasy - Article Automation V2'"
echo "   - Cliquer sur 'Execute Workflow'"
echo ""
echo "2. Vérifier les résultats dans Supabase:"
echo "   - Table: articles"
echo "   - Filtrer par: source = 'n8n'"
echo ""
echo "3. Activer le workflow une fois testé:"
echo -e "   ${YELLOW}n8n update:workflow --id=$WORKFLOW_ID --active=true${NC}"
echo ""
echo "4. Consulter le rapport détaillé:"
echo -e "   ${YELLOW}cat $REPORT_FILE${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo ""

# Proposer d'activer le workflow
read -p "Voulez-vous activer le workflow maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Activation du workflow...${NC}"
    if n8n update:workflow --id="$WORKFLOW_ID" --active=true; then
        echo -e "${GREEN}✓ Workflow activé${NC}"
        echo ""
        echo -e "${YELLOW}Le workflow s'exécutera automatiquement tous les jours à 8h du matin.${NC}"
    else
        echo -e "${RED}✗ Échec de l'activation${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}Workflow importé mais pas activé.${NC}"
    echo -e "${YELLOW}Pensez à le tester avant de l'activer!${NC}"
fi

echo ""
echo -e "${GREEN}Script terminé.${NC}"
