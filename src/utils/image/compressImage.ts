// ---------------------------------------------------------------------------
// Compression/redimensionnement d'image côté client, sans dépendance (canvas).
// Sert à alléger les uploads de photos de profil : sur mobile, une photo brute
// pèse 5-12 Mo, ce qui rend l'upload lent/instable sur réseau PH.
// ---------------------------------------------------------------------------

interface CompressOptions {
  /** Côté le plus long, en px (défaut 1600). */
  maxDimension?: number;
  /** Qualité JPEG/WebP 0-1 (défaut 0.82). */
  quality?: number;
}

/**
 * Redimensionne et recompresse une image. Renvoie le fichier compressé, ou le
 * fichier d'origine si la compression échoue ou n'apporte rien (ex. déjà petit,
 * format non décodable). Ne throw jamais — l'upload doit rester possible.
 */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxDimension = 1600, quality = 0.82 } = opts;

  // Pas d'image, ou déjà léger : ne rien faire.
  if (!file.type.startsWith('image/')) return file;
  if (typeof document === 'undefined' || typeof createImageBitmap === 'undefined') return file;
  // HEIC/HEIF ne se décodent pas partout via createImageBitmap : on laisse tel quel.
  if (file.type === 'image/heic' || file.type === 'image/heif') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    // JPEG : bon ratio poids/qualité et supporté partout. On garde PNG→JPEG
    // (pas de transparence utile sur une photo de profil).
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob || blob.size >= file.size) return file; // aucune amélioration

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}
