/**
 * Générateur automatique de meta descriptions optimisées pour le SEO
 * Extrait intelligemment le contenu et génère des descriptions uniques
 * Respecte les bonnes pratiques Google (150-160 caractères)
 */

import { EditorJSContent } from '@/types';

interface MetaDescriptionOptions {
  maxLength?: number;
  addEllipsis?: boolean;
  includeKeywords?: string[];
}

/**
 * Extrait du texte propre depuis un contenu EditorJS
 */
export function extractTextFromEditorJS(content: string | EditorJSContent): string {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content) as EditorJSContent;
      return extractTextFromBlocks(parsed.blocks || []);
    } catch {
      // Si ce n'est pas du JSON, retourner tel quel en nettoyant les balises HTML
      return content.replace(/<[^>]+>/g, '').trim();
    }
  }

  if (content?.blocks) {
    return extractTextFromBlocks(content.blocks);
  }

  return '';
}

/**
 * Extrait le texte depuis les blocks EditorJS
 */
function extractTextFromBlocks(blocks: any[]): string {
  let text = '';

  for (const block of blocks) {
    // Extraire selon le type de block
    switch (block.type) {
      case 'paragraph':
      case 'header':
        if (block.data?.text) {
          text += cleanHtmlTags(block.data.text) + ' ';
        }
        break;
      case 'list':
        if (block.data?.items) {
          text += block.data.items.map((item: string) => cleanHtmlTags(item)).join(', ') + '. ';
        }
        break;
      case 'quote':
        if (block.data?.text) {
          text += '"' + cleanHtmlTags(block.data.text) + '" ';
        }
        break;
      default:
        // Ignorer les autres types (image, embed, etc.)
        break;
    }

    // Arrêter si on a assez de texte (300 caractères pour avoir de la marge)
    if (text.length > 300) {
      break;
    }
  }

  return text.trim();
}

/**
 * Nettoie les balises HTML d'un texte
 */
function cleanHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim();
}

/**
 * Génère une meta description optimisée pour un article
 */
export function generateArticleMetaDescription(
  title: string,
  content: string | EditorJSContent,
  categoryName?: string,
  options: MetaDescriptionOptions = {}
): string {
  const {
    maxLength = 155,
    addEllipsis = true,
    includeKeywords = ['Philippines'],
  } = options;

  // Extraire le texte du contenu
  const extractedText = extractTextFromEditorJS(content);

  if (!extractedText) {
    // Fallback : générer depuis le titre et la catégorie
    const fallback = categoryName
      ? `Découvrez ${title} - ${categoryName} aux Philippines. Guide complet, conseils pratiques et informations utiles.`
      : `${title} - Toutes les informations sur les Philippines.`;
    return truncateToWords(fallback, maxLength, addEllipsis);
  }

  // Nettoyer et optimiser le texte extrait
  let description = extractedText
    .replace(/\s+/g, ' ')  // Normaliser les espaces
    .replace(/\.\s+/g, '. ')  // Normaliser les points
    .trim();

  // Si le texte commence par une phrase complète, la privilégier
  const firstSentence = description.split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length >= 80 && firstSentence.length <= maxLength) {
    description = firstSentence + '.';
  } else {
    // Sinon, tronquer intelligemment
    description = truncateToWords(description, maxLength, addEllipsis);
  }

  return description;
}

/**
 * Génère une meta description pour une catégorie
 */
export function generateCategoryMetaDescription(
  categoryName: string,
  categoryDescription?: string,
  mainCategory?: string,
  options: MetaDescriptionOptions = {}
): string {
  const { maxLength = 155, addEllipsis = false } = options;

  if (categoryDescription) {
    return truncateToWords(categoryDescription, maxLength, addEllipsis);
  }

  // Générer une description par défaut
  const mainCategoryLabel = mainCategory
    ? mainCategory.replace(/-/g, ' ')
    : 'Philippines';

  const description = `Découvrez tous les articles sur ${categoryName} - ${mainCategoryLabel}. Guides, conseils pratiques et informations utiles pour votre projet aux Philippines.`;

  return truncateToWords(description, maxLength, addEllipsis);
}

/**
 * Génère une meta description pour un sujet de forum
 */
export function generateForumTopicMetaDescription(
  topicTitle: string,
  firstPostContent?: string,
  categoryName?: string,
  options: MetaDescriptionOptions = {}
): string {
  const { maxLength = 155, addEllipsis = true } = options;

  if (firstPostContent) {
    const cleanContent = extractTextFromEditorJS(firstPostContent);
    if (cleanContent) {
      return truncateToWords(cleanContent, maxLength, addEllipsis);
    }
  }

  // Fallback
  const category = categoryName ? ` dans ${categoryName}` : '';
  const description = `Discussion : ${topicTitle}${category}. Posez vos questions, partagez vos expériences avec la communauté francophone des Philippines.`;

  return truncateToWords(description, maxLength, addEllipsis);
}

/**
 * Génère une meta description pour un produit
 */
export function generateProductMetaDescription(
  productName: string,
  productDescription: string,
  price?: number,
  categoryName?: string,
  options: MetaDescriptionOptions = {}
): string {
  const { maxLength = 155, addEllipsis = true } = options;

  // Commencer avec le nom et le prix si disponible
  let description = productName;

  if (price !== undefined) {
    description += ` - ${price.toFixed(2)} €`;
  }

  if (categoryName) {
    description += ` | ${categoryName}`;
  }

  description += '. ' + productDescription;

  return truncateToWords(description, maxLength, addEllipsis);
}

/**
 * Tronque un texte intelligemment au niveau des mots
 * Ne coupe jamais au milieu d'un mot
 */
export function truncateToWords(
  text: string,
  maxLength: number,
  addEllipsis: boolean = true
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Trouver le dernier espace avant maxLength
  let truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }

  // Enlever les ponctuations finales orphelines
  truncated = truncated.replace(/[,;:]\s*$/, '');

  // Ajouter "..." si le texte a été tronqué
  if (addEllipsis && text.length > maxLength) {
    truncated += '...';
  }

  return truncated.trim();
}

/**
 * Valide une meta description selon les bonnes pratiques SEO
 */
export function validateMetaDescription(description: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isValid = true;

  // Longueur recommandée : 150-160 caractères
  if (description.length < 120) {
    warnings.push('Description trop courte (< 120 caractères). Recommandation : 150-160 caractères.');
  }

  if (description.length > 160) {
    warnings.push('Description trop longue (> 160 caractères). Google risque de la tronquer.');
    isValid = false;
  }

  // Vérifier qu'il n'y a pas de balises HTML
  if (/<[^>]+>/.test(description)) {
    warnings.push('La description contient des balises HTML.');
    isValid = false;
  }

  // Vérifier qu'il n'y a pas de guillemets non échappés
  if (description.includes('"') && !description.includes('&quot;')) {
    warnings.push('La description contient des guillemets non échappés.');
  }

  return { isValid, warnings };
}
