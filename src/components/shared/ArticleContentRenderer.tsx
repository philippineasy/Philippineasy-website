'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

const generateSlug = (text: string) => {
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

const generateAltTextFromUrl = (url: string, caption?: string): string => {
  if (caption) {
    return caption;
  }
  try {
    if (!url) return "Image de l'article";
    const fileNameWithTimestamp = url.split('/').pop();
    if (!fileNameWithTimestamp) return "Image de l'article";
    
    const decodedFileName = decodeURIComponent(fileNameWithTimestamp);
    const fileName = decodedFileName.substring(decodedFileName.indexOf('_') + 1);
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    const altText = nameWithoutExtension.replace(/[-_]/g, ' ');
    
    if (!altText) return "Image de l'article";
    return altText.charAt(0).toUpperCase() + altText.slice(1);
  } catch (e) {
    console.error("Could not generate alt text from image url", e);
    return "Image de l'article";
  }
};

interface Block {
  type: string;
  data: any;
}

const renderEditorJsData = (data: { blocks: Block[] }) => {
  if (!data || !data.blocks) return null;

  return data.blocks.map((block: Block, index: number) => {
    switch (block.type) {
      case 'header':
        const slug = generateSlug(block.data.text);
        const HeaderTag = `h${block.data.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return <HeaderTag key={index} id={slug} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
      case 'paragraph':
        return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={block.data.style === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside'}>
            {block.data.items.map((item: any, i: number) => {
              // Handle both string and object list items
              const content = typeof item === 'object' && item.content ? item.content : item;
              return <li key={i} dangerouslySetInnerHTML={{ __html: content }} />;
            })}
          </ListTag>
        );
      case 'quote':
        return (
          <blockquote key={index}>
            {block.data.caption && <p className="font-bold text-orange-700">{block.data.caption}</p>}
            <div dangerouslySetInnerHTML={{ __html: block.data.text }} />
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-8 max-w-3xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
              <Image 
                src={block.data.file.url} 
                alt={generateAltTextFromUrl(block.data.file.url, block.data.caption)} 
                fill
                className="rounded-lg shadow-md object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
            {block.data.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.data.caption}</figcaption>}
          </figure>
        );
      case 'table':
        return (
          <table key={index} className="w-full border-collapse border border-border my-4">
            <tbody>
              {block.data.content.map((row: string[], i: number) => (
                <tr key={i} className="border-b border-border">
                  {row.map((cell: string, j: number) => (
                    <td key={j} className="p-2 border border-border" dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'delimiter':
        return <hr key={index} className="my-4" />;
      case 'embed':
        return (
          <figure key={index} className="my-8 max-w-3xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={block.data.embed}
                className="absolute inset-0 w-full h-full rounded-lg shadow-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={block.data.caption || 'Vidéo intégrée'}
              />
            </div>
            {block.data.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      default:
        return null;
    }
  });
};

interface ArticleContentRendererProps {
    content: string | { blocks: Block[] };
}

const parseHtmlToBlocks = (html: string): Block[] => {
  if (typeof window === 'undefined') {
    return [{ type: 'paragraph', data: { text: html } }];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: Block[] = [];
  doc.body.childNodes.forEach(node => {
    if (node.nodeName.startsWith('H')) {
      const level = parseInt(node.nodeName.substring(1), 10);
      blocks.push({ type: 'header', data: { text: (node as HTMLElement).innerHTML, level } });
    } else {
      blocks.push({ type: 'paragraph', data: { text: (node as HTMLElement).outerHTML || node.textContent } });
    }
  });
  return blocks;
};

const ArticleContentRenderer = ({ content }: ArticleContentRendererProps) => {
    const parsedContent = useMemo(() => {
        if (!content) return null;

        if (typeof content === 'object' && content !== null && Array.isArray(content.blocks)) {
            return content;
        }

        if (typeof content === 'string') {
            try {
                if (content.trim().startsWith('{')) {
                    const parsed = JSON.parse(content);
                    if (parsed && Array.isArray(parsed.blocks)) {
                        return parsed;
                    }
                }
                return { blocks: parseHtmlToBlocks(content) };
            } catch (e) {
                console.error("Impossible de parser le contenu de l'article, traitement en texte brut:", e);
                return { blocks: parseHtmlToBlocks(content) };
            }
        }
        return null;
    }, [content]);

    return <>{renderEditorJsData(parsedContent as { blocks: Block[] })}</>;
};

export default ArticleContentRenderer;
