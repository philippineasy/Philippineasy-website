import { Profile } from '@/types';

interface ProfileJsonLdProps {
  profile: Profile;
}

const ProfileJsonLd = ({ profile }: ProfileJsonLdProps) => {
  const siteUrl = 'https://philippineasy.com';
  const profileUrl = `${siteUrl}/profil`; // This is the main profile page for the logged-in user

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': profileUrl,
    },
    about: {
      '@type': 'Person',
      name: profile.username,
      description: profile.bio || '',
      image: profile.avatar_url || '',
      mainEntityOfPage: profileUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ProfileJsonLd;
