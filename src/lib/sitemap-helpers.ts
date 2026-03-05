const BASE_URL = 'https://philippineasy.com';

export const escapeXml = (str: string) =>
  str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return c;
    }
  });

export const getRawFileName = (url: string) => {
  try {
    const u = new URL(url);
    const pathname = u.pathname || '';
    return decodeURIComponent(pathname.split('/').pop() || '');
  } catch {
    const noQuery = url.split('?')[0];
    return decodeURIComponent(noQuery.split('/').pop() || '');
  }
};

export const cleanFileName = (name: string) => {
  const lower = name.toLowerCase();
  const withoutPrefix = lower
    .replace(/^thumbnail_\d+_/, '')
    .replace(/^\d+[-_]/, '');
  const parts = withoutPrefix.split('.');
  const ext = parts.length > 1 ? '.' + parts.pop() : '';
  const base = parts.join('.');
  const slug = base
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return (slug || 'image') + (ext || '.webp');
};

export const toSeoImage = (sourceUrl: string, folder: 'articles' | 'products' | 'pages' | 'hero' | 'uploads' = 'uploads') => {
  const fileName = cleanFileName(getRawFileName(sourceUrl));
  return `${BASE_URL}/images/${folder}/${fileName}`;
};
