import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '@/lib/utils';
import type { EditorJSBlock } from '@/types';

const TableOfContents = ({ blocks }: { blocks: EditorJSBlock[] }) => {
  const headers = blocks.filter(block => block.type === 'header' && (block.data.level === 2 || block.data.level === 3));

  if (headers.length === 0) {
    return <p className="text-sm text-muted-foreground">Cet article n'a pas de sommaire.</p>;
  }

  return (
    <ul className="space-y-2">
      {headers.map((header, index) => {
        const slug = generateSlug(header.data.text);
        const isH3 = header.data.level === 3;
        
        const containerClasses = isH3 ? "pl-4" : "";
        const linkClasses = "flex items-center p-1 rounded-md hover:bg-primary/10 group transition-colors duration-200";
        const icon = <FontAwesomeIcon icon={faCircle} className={`w-2 h-2 mr-3 flex-shrink-0 ${isH3 ? 'text-blue-400' : 'text-primary'}`} />;
        const textClasses = `group-hover:underline ${isH3 ? 'text-sm text-primary' : 'font-medium text-primary/90'}`;

        return (
          <li key={index} className={containerClasses}>
            <a href={`#${slug}`} className={linkClasses}>
              {icon}
              <span className={textClasses}>
                {header.data.text}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default TableOfContents;
