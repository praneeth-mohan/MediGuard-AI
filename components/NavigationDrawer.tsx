import React from 'react';
import { AppScreen, UserProfile, UI_TRANSLATIONS, Language } from '../types';
import { LayoutDashboard, MessageSquare, Siren, Info, X, LogOut, Settings, UserCircle } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onSignOut: () => void;
  profile: UserProfile | null;
  language: Language;
  onToggleTheme: () => void;
  isDark: boolean;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ 
  isOpen, 
  onClose, 
  currentScreen, 
  onNavigate,
  onSignOut,
  profile,
  language
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  const menuItems: { id: AppScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { id: 'chat', label: t.chat, icon: <MessageSquare size={20} /> },
    { id: 'settings', label: t.settings, icon: <Settings size={20} /> },
    { id: 'emergency', label: t.emergency, icon: <Siren size={20} /> },
    { id: 'credits', label: t.credits, icon: <Info size={20} /> },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-[300px] bg-surface dark:bg-neutral-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out rounded-r-3xl flex flex-col overflow-hidden border-r border-gray-100 dark:border-neutral-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with User Info */}
        <div className="p-6 bg-primary/10 dark:bg-neutral-800/50 border-b border-primary/5 dark:border-neutral-800">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-primary/20 dark:bg-teal-900/50 p-2 rounded-full">
                <UserCircle size={32} className="text-primary dark:text-teal-400" />
             </div>
             <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition">
                <X size={20} className="text-gray-500 dark:text-gray-400" />
             </button>
          </div>
          <div>
              <h2 className="font-bold text-lg text-gray-800 dark:text-white">{profile ? profile.name : t.guest}</h2>
              {profile && <p className="text-xs text-gray-500 dark:text-gray-400">{profile.email}</p>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                currentScreen === item.id 
                  ? 'bg-primary/10 dark:bg-teal-500/20 text-primary dark:text-teal-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 space-y-2">
            
            {profile ? (
                <button 
                    onClick={onSignOut}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={20} />
                    {t.logout}
                </button>
            ) : (
                <button 
                    onClick={() => { onNavigate('dashboard'); onClose(); }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-sm font-medium text-primary dark:text-teal-400 hover:bg-primary/5 dark:hover:bg-teal-500/10 transition-colors"
                >
                    <LogOut size={20} className="rotate-180" />
                    {t.signIn}
                </button>
            )}
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;