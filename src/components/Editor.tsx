'use client';

import { memo, useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { supabase } from '@/utils/supabase/client';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph'; // Import Paragraph
import { uploadImage } from '@/services/uploadService';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter';

interface EditorProps {
  data?: OutputData;
  onChange(data: OutputData): void;
  holder: string;
}

const Editor = ({ data, onChange, holder }: EditorProps) => {
  const ref = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (ref.current) {
      return;
    }
    const editor = new EditorJS({
      holder: holder,
      tools: {
        paragraph: { // Add Paragraph tool
          class: Paragraph,
          inlineToolbar: true,
        },
        header: Header,
        list: List,
        quote: Quote,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: (file: File) => uploadImage(supabase, file),
            },
          },
        },
        table: Table,
        embed: Embed,
        delimiter: Delimiter,
      },
      data: data,
      i18n: {
        messages: {
            ui: {
                "blockTunes": {
                    "toggler": {
                        "Click to tune": "Cliquer pour configurer",
                        "or drag to move": "ou glisser pour déplacer"
                    }
                },
                "inlineToolbar": {
                    "converter": {
                        "Convert to": "Convertir en"
                    }
                },
                "toolbar": {
                    "toolbox": {
                        "Add": "Ajouter"
                    }
                },
                "popover": {
                    "Nothing found": "Rien trouvé",
                    "Search": "Rechercher"
                }
            },
            toolNames: {
                "Text": "Paragraphe",
                "Heading": "Titre",
                "List": "Liste",
                "Quote": "Citation",
                "Image": "Image",
                "Table": "Tableau",
                "Embed": "Intégration",
                "Delimiter": "Séparateur",
                "Warning": "Avertissement",
                "Checklist": "Liste à cocher",
                "Code": "Code",
                "Raw": "HTML Brut",
                "Bold": "Gras",
                "Italic": "Italique",
                "Link": "Lien"
            },
            tools: {
                "link": {
                    "Add a link": "Ajouter un lien",
                    "Set link": "Définir le lien",
                    "Unlink": "Supprimer le lien"
                },
                "stub": {
                    'The block can not be displayed correctly.': 'Ce bloc ne peut pas être affiché correctement.'
                },
                "image": { // Assuming ImageTool might have these
                    "Caption": "Légende",
                    "Select an Image": "Sélectionner une image",
                    "With border": "Avec bordure",
                    "Stretch image": "Étirer l'image",
                    "With background": "Avec arrière-plan"
                },
                "header": { // Assuming Header tool might have these
                    "Header": "Titre" // Default placeholder
                },
                "list": { // Assuming List tool might have these
                    "Ordered": "Ordonnée",
                    "Unordered": "Non ordonnée"
                },
                "code": { // Assuming Code tool
                    "Enter a code": "Entrez du code"
                },
                "checklist": {
                    "Enter a checklist item": "Entrer un élément de la liste"
                }
            },
            blockTunes: {
                "delete": {
                    "Delete": "Supprimer",
                    "Click to delete": "Cliquer pour supprimer"
                },
                "moveUp": {
                    "Move up": "Déplacer vers le haut"
                },
                "moveDown": {
                    "Move down": "Déplacer vers le bas"
                },
                "filter": { // Example for a tune
                    "Filter": "Filtrer"
                }
            }
        }
    },
      async onChange(api) {
        const savedData = await api.saver.save();
        onChange(savedData);
      },
    });
    ref.current = editor;

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, [data, holder, onChange]);

  return <div id={holder} className="prose max-w-none" />;
};

export default memo(Editor);
