
import React, { useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, UserProfile, UI_TRANSLATIONS, AppScreen } from '../types';
import { Globe, Users, Save, Check, ArrowRight, UserPlus, Palette } from 'lucide-react';

interface SettingsProps {
  language: Language;
  setLanguage: (l: Language) => void;
  profile: UserProfile | null;
  updateProfile: (p: UserProfile) => void;
  onNavigate: (screen: AppScreen) => void;
}

const Settings: React.FC<SettingsProps> = ({ language, setLanguage, profile, updateProfile, onNavigate }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];
  
  // Initialize local state for manual saving
  const [localContacts, setLocalContacts] = useState<[any, any]>(
      profile?.contacts || [{name: '', number: ''}, {name: '', number: ''}]
  );
  const [isSaved, setIsSaved] = useState(false);

  // Sync with profile if it updates externally (e.g. after login)
  useEffect(() => {
      if (profile) {
          setLocalContacts(profile.contacts);
      }
  }, [profile]); 

  const handleContactChange = (index: 0 | 1, field: 'name' | 'number', value: string) => {
      const newContacts = [...localContacts];
      newContacts[index] = { ...newContacts[index], [field]: value };
      setLocalContacts(newContacts as [any, any]);
      setIsSaved(false);
  };

  const handleSave = () => {
      if (!profile) return;
      updateProfile({ ...profile, contacts: localContacts });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
  };

  const themeColors = [
      { name: 'Teal', value: '#006a6a' },
      { name: 'Blue', value: '#3b82f6' },
      { name: 'Green', value: '#15803d' },
      { name: 'Light Blue', value: '#0ea5e9' },
      { name: 'Purple', value: '#7c3aed' },
      { name: 'Orange', value: '#ea580c' },
  ];

  const handleColorChange = (color: string) => {
      if (profile) {
          updateProfile({ ...profile, themeColor: color });
      }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-2xl mx-auto h-full overflow-y-auto pb-32">
       
       {/* Language Section */}
       <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Globe className="text-primary" /> {t.language}
          </h2>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800">
             <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl border-none outline-none text-gray-900 dark:text-gray-200"
             >
                 {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                     <option key={code} value={code} className="text-gray-900">{name}</option>
                 ))}
             </select>
          </div>
       </div>

       {/* Theme Color Section */}
       {profile && (
           <div className="space-y-4">
               <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                   <Palette className="text-primary" /> {t.theme}
               </h2>
               <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
                   <div className="flex flex-wrap gap-4">
                       {themeColors.map((color) => (
                           <button
                               key={color.value}
                               onClick={() => handleColorChange(color.value)}
                               className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 ${
                                   profile.themeColor === color.value 
                                   ? 'border-gray-800 dark:border-white scale-110' 
                                   : 'border-transparent'
                               }`}
                               style={{ backgroundColor: color.value }}
                               aria-label={color.name}
                           />
                       ))}
                   </div>
               </div>
           </div>
       )}

       {/* Contacts Section */}
       <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Users className="text-primary" /> {t.emergencyContacts}
            </h2>
            
            {profile ? (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 space-y-6">
                    {/* Contact 1 */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t.contact1}</p>
                            <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">{t.priorityCall}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <input 
                                placeholder={t.name}
                                value={localContacts[0].name}
                                onChange={(e) => handleContactChange(0, 'name', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 ring-primary/20 outline-none transition" 
                            />
                            <input 
                                placeholder={t.number}
                                type="tel"
                                value={localContacts[0].number}
                                onChange={(e) => handleContactChange(0, 'number', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 ring-primary/20 outline-none transition" 
                            />
                        </div>
                    </div>

                    {/* Contact 2 */}
                    <div className="border-t border-gray-100 dark:border-neutral-800 pt-6 space-y-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t.contact2}</p>
                        <div className="grid grid-cols-1 gap-3">
                            <input 
                                placeholder={t.name}
                                value={localContacts[1].name}
                                onChange={(e) => handleContactChange(1, 'name', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 ring-primary/20 outline-none transition" 
                            />
                            <input 
                                placeholder={t.number}
                                type="tel"
                                value={localContacts[1].number}
                                onChange={(e) => handleContactChange(1, 'number', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 ring-primary/20 outline-none transition" 
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                            isSaved 
                            ? 'bg-green-500 text-white dark:bg-green-600' 
                            : 'bg-primary text-white hover:bg-opacity-90'
                        }`}
                    >
                        {isSaved ? <><Check size={20} /> {t.saved}</> : <><Save size={20} /> {t.saveContacts}</>}
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">{t.setupRequired}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            To add emergency contacts and allow 1-tap calling, you need to create your medical profile first.
                        </p>
                    </div>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
                    >
                        {t.createProfile} <ArrowRight size={18} />
                    </button>
                </div>
            )}
       </div>
    </div>
  );
};

export default Settings;