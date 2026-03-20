
import React from 'react';
import { Phone, AlertOctagon, User, Plus } from 'lucide-react';
import { UserProfile, UI_TRANSLATIONS, AppScreen } from '../types';

interface EmergencyProps {
    profile: UserProfile | null;
    language?: string;
    onNavigate: (screen: AppScreen) => void;
}

const Emergency: React.FC<EmergencyProps> = ({ profile, language, onNavigate }) => {
  const t = UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS] || UI_TRANSLATIONS['en'];

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center space-y-6 animate-pulse-slow">
      <div className="bg-red-50 p-6 rounded-full ring-4 ring-red-100">
         <AlertOctagon size={64} className="text-red-600" />
      </div>
      
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.emergency}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t.immediateAssist}</p>
      </div>

      <a href="tel:112" className="w-full max-w-xs bg-red-600 text-white rounded-[28px] py-6 text-xl font-bold shadow-xl shadow-red-200 dark:shadow-red-900/20 active:scale-95 transition-transform flex items-center justify-center gap-3">
         <Phone size={28} />
         {t.call112}
      </a>

      {profile && (
          <div className="w-full max-w-xs space-y-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-center mb-4">{t.savedContacts}</p>
              
              {[0, 1].map((index) => {
                  const contact = profile.contacts[index];
                  const hasContact = contact && contact.name && contact.number;

                  if (hasContact) {
                      return (
                        <a 
                            key={index} 
                            href={`tel:${contact.number}`}
                            className="flex items-center justify-between w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-white rounded-[20px] px-6 py-4 font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 transition active:bg-gray-100 dark:active:bg-neutral-600"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="bg-primary/10 dark:bg-teal-500/20 p-2 rounded-full">
                                    <User size={18} className="text-primary dark:text-teal-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm">{contact.name}</span>
                                    <span className="text-xs text-gray-400 font-normal">{contact.number}</span>
                                </div>
                            </div>
                            <Phone size={18} className="text-green-600 dark:text-green-400" />
                        </a>
                      );
                  }

                  return (
                      <button
                        key={index}
                        onClick={() => onNavigate('settings')}
                        className="flex items-center justify-center gap-2 w-full bg-gray-50 dark:bg-neutral-800/50 border-2 border-dashed border-gray-300 dark:border-neutral-700 text-gray-400 rounded-[20px] px-6 py-4 font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition hover:border-gray-400 dark:hover:border-neutral-600"
                      >
                         <Plus size={18} /> {t.emergencyContacts} {index + 1}
                      </button>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default Emergency;
