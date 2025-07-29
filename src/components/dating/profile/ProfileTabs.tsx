'use client';

import { useState, ReactNode } from 'react';
import { DatingProfile } from '@/types';
import { questionMap } from '@/utils/dating/questions';
import { detailTranslations, answerTranslations } from '@/utils/dating/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faInfoCircle, faHeart, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

interface ProfileTabsProps {
  profile: DatingProfile;
}

const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'À propos', icon: faUser },
    { id: 'details', label: 'Détails', icon: faInfoCircle },
    { id: 'interests', label: 'Intérêts', icon: faHeart },
    { id: 'questions', label: 'Questions', icon: faQuestionCircle, disabled: !profile.answers || profile.answers.length === 0 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <p className="text-gray-700 leading-relaxed break-words">{profile.description}</p>;
      case 'details':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
            {profile.height && <p><strong className="font-semibold text-primary">Taille:</strong> {profile.height} cm</p>}
            {profile.orientation && <p><strong className="font-semibold text-primary">Orientation:</strong> {profile.orientation}</p>}
            {profile.religion && <p><strong className="font-semibold text-primary">Religion:</strong> {detailTranslations.religion[profile.religion] || profile.religion}</p>}
            {profile.education && <p><strong className="font-semibold text-primary">Éducation:</strong> {profile.education}</p>}
            {profile.occupation && <p><strong className="font-semibold text-primary">Profession:</strong> {profile.occupation}</p>}
            {profile.dating_intent && <p><strong className="font-semibold text-primary">Recherche:</strong> {detailTranslations.dating_intent[profile.dating_intent] || profile.dating_intent}</p>}
          </div>
        );
      case 'interests':
        return (
          <div className="flex flex-wrap gap-3">
            {profile.interests.map(interest => (
              <div key={interest.id} className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="text-lg">{interest.icon}</span>
                <span>{interest.name}</span>
              </div>
            ))}
          </div>
        );
      case 'questions':
        return (
          <ul className="space-y-6">
            {profile.answers?.map((answer, index) => {
              const translatedAnswer = answerTranslations[answer.question_key]?.[answer.answer] || answer.answer;
              return (
                <li key={`${answer.question_key}-${index}`}>
                  <p className="font-semibold text-accent">{questionMap[answer.question_key] || answer.question_key}</p>
                  <p className="text-gray-700 italic mt-2 pl-4 border-l-2 border-gray-200">"{translatedAnswer}"</p>
                </li>
              );
            })}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 px-4 sm:px-6" aria-label="Tabs">
          {tabs.map(tab => (
            !tab.disabled && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm sm:text-base transition-colors flex items-center
                `}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            )
          ))}
        </nav>
      </div>
      <div className="p-6 md:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileTabs;
