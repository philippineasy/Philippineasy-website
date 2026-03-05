'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faXTwitter, faWhatsapp, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-accent font-medium pulse-animation">Partager sur :</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" title="Partager sur Facebook" className="text-muted-foreground hover:text-primary">
        <FontAwesomeIcon icon={faFacebookF} size="lg" />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${url}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" title="Partager sur Twitter" className="text-muted-foreground hover:text-foreground">
        <FontAwesomeIcon icon={faXTwitter} size="lg" />
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodedTitle} ${url}`} target="_blank" rel="noopener noreferrer" title="Partager sur WhatsApp" className="text-muted-foreground hover:text-green-500">
        <FontAwesomeIcon icon={faWhatsapp} size="lg" />
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" title="Partager sur LinkedIn" className="text-muted-foreground hover:text-primary/90">
        <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
      </a>
      <button onClick={() => navigator.clipboard.writeText(url)} title="Copier le lien" className="text-muted-foreground hover:text-primary">
        <FontAwesomeIcon icon={faLink} size="lg" />
      </button>
    </div>
  );
};

export default ShareButtons;
