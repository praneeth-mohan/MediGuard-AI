
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { UI_TRANSLATIONS, Language } from '../types';

interface CreditsProps {
    onTriggerEasterEgg: (type: 'bw' | 'neon' | 'modal' | 'hindi' | 'bomb' | 'clear') => void;
    language?: Language;
}

const Credits: React.FC<CreditsProps> = ({ onTriggerEasterEgg, language }) => {
  const [clickState, setClickState] = useState<Record<string, { count: number, lastClick: number }>>({});
  const t = UI_TRANSLATIONS[language || 'en'] || UI_TRANSLATIONS['en'];

  const handleSmartClick = (name: string, eggType: 'bw' | 'neon' | 'modal' | 'hindi' | 'bomb') => {
      const now = Date.now();
      const current = clickState[name] || { count: 0, lastClick: 0 };
      
      // Reset if too slow (more than 1 second between clicks)
      if (now - current.lastClick > 1000) {
          setClickState(prev => ({ ...prev, [name]: { count: 1, lastClick: now } }));
          return;
      }

      const newCount = current.count + 1;

      if (newCount === 2) {
          // Trigger Easter Egg
          onTriggerEasterEgg(eggType);
          // Reset count
          setClickState(prev => ({ ...prev, [name]: { count: 0, lastClick: now } }));
      } else {
          // Update count
          setClickState(prev => ({ ...prev, [name]: { count: newCount, lastClick: now } }));
      }
  };

  const developers = [
      { name: "Kodi Nandini", egg: 'bw' as const, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
      { name: "Sindhu", egg: 'neon' as const, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
      { name: "Amalapurapu Praneeth Mohan", egg: 'modal' as const, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" },
      { name: "Rohit", egg: 'hindi' as const, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
      { name: "Noya", egg: 'bomb' as const, color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  ];

  return (
    <div className="p-8 h-full flex flex-col items-center space-y-8 overflow-y-auto animate-fade-in">
      <div className="text-center space-y-2 mt-4">
         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t.credits}</h1>
         <p className="text-sm text-gray-500 dark:text-gray-400">{t.meetTeam}</p>
         <p className="text-xs text-gray-300 dark:text-gray-600">{t.doubleTap}</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
          {developers.map((dev) => (
              <div 
                key={dev.name}
                onClick={() => handleSmartClick(dev.name, dev.egg)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
              >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dev.color}`}>
                      {dev.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{dev.name}</span>
              </div>
          ))}
      </div>

      <div className="mt-auto pt-8 flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
        <span>{t.madeWith}</span>
        <Heart size={16} className="text-red-400 fill-red-400 animate-pulse" />
      </div>
    </div>
  );
};

export default Credits;
