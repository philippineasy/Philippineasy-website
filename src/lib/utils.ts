import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSlug = (text: string) => {
  if (!text) return '';
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    .substring(0, 75); // Truncate to 75 chars
};

const getMainCategoryPath = (mainCategorySlug: string | null | undefined) => {
    if (!mainCategorySlug) return 'actualites-sur-les-philippines'; // Fallback
    switch (mainCategorySlug) {
      case 'actualites-sur-les-philippines':
        return 'actualites-sur-les-philippines';
      case 'meilleurs-plans-aux-philippines':
        return 'meilleurs-plans-aux-philippines';
      case 'vivre-aux-philippines':
        return 'vivre-aux-philippines';
      case 'voyager-aux-philippines':
        return 'voyager-aux-philippines';
      default:
        return 'actualites-sur-les-philippines'; // Fallback for any other case
    }
};

export const generateArticleUrl = (article: { category: { main_category?: string; slug: string; }; slug: string; }) => {
  if (!article || !article.category || !article.slug) {
    return '/';
  }
  const mainCategoryPath = getMainCategoryPath(article.category.main_category);
  return `/${mainCategoryPath}/${article.category.slug}/${article.slug}`;
};

export const generateForumTopicUrl = (topic: { slug: string; }) => {
  if (!topic || !topic.slug) {
    return '/forum-sur-les-philippines';
  }
  return `/forum-sur-les-philippines/sujet/${topic.slug}`;
};
