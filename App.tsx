
import React, { useState, useEffect } from 'react';
import { Menu, MessageSquare, Sun, Moon } from 'lucide-react';
import NavigationDrawer from './components/NavigationDrawer';
import Dashboard from './components/Dashboard';
import ChatScreen from './components/ChatScreen';
import Emergency from './components/Emergency';
import Credits from './components/Credits';
import Settings from './components/Settings';
import { UserProfile, AppScreen, Language, ChatMessage } from './types';

const App: React.FC = () => {
  // Global State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  
  // Chat History Persistence
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mediguard_chat');
    if (saved) {
      try {
        return JSON.parse(saved).map((m: any) => ({
          ...m, 
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  // Theme & Effect State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [easterEgg, setEasterEgg] = useState<'none' | 'bw' | 'neon' | 'bomb' | 'modal'>('none');
  const [flash, setFlash] = useState(false);
  const [bombTimer, setBombTimer] = useState(0);

  // Persistence (Profile)
  useEffect(() => {
     const savedProfile = localStorage.getItem('mediguard_profile');
     if (savedProfile) {
       setProfile(JSON.parse(savedProfile));
     }
  }, []);

  useEffect(() => {
     const color = profile?.themeColor || '#006a6a';
     
     if (profile) {
       localStorage.setItem('mediguard_profile', JSON.stringify(profile));
       document.documentElement.style.setProperty('--primary-color', color);
     } else {
       localStorage.removeItem('mediguard_profile');
       document.documentElement.style.setProperty('--primary-color', '#006a6a'); // Default
     }

     // Update Meta Theme Color for Android/PWA Status Bar
     const metaThemeColor = document.querySelector("meta[name='theme-color']");
     if (metaThemeColor) {
         metaThemeColor.setAttribute("content", theme === 'dark' ? '#000000' : color);
     }

  }, [profile, theme]);

  // Persistence (Chat)
  useEffect(() => {
    localStorage.setItem('mediguard_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Apply Theme Classes to Body
  useEffect(() => {
      // Remove basic theme classes first
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('theme-bw', 'theme-neon');
      
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
      }
      
      if (easterEgg === 'bw') document.body.classList.add('theme-bw');
      if (easterEgg === 'neon') document.body.classList.add('theme-neon');
  }, [theme, easterEgg]);

  // Bomb Timer Logic
  useEffect(() => {
    let interval: any;
    if (easterEgg === 'bomb') {
        if (bombTimer > 0) {
            interval = setInterval(() => {
                setBombTimer((prev) => prev - 1);
            }, 1000);
        } else {
            // Timer finished
            setEasterEgg('none');
            setFlash(true);
            setTimeout(() => setFlash(false), 1000);
        }
    }
    return () => clearInterval(interval);
  }, [easterEgg, bombTimer]);

  // Handlers
  const handleEasterEggTrigger = (type: 'bw' | 'neon' | 'modal' | 'hindi' | 'bomb' | 'clear') => {
      if (type === 'clear') {
          setEasterEgg('none');
          if (language === 'hi') setLanguage('en');
          return;
      }
      
      if (type === 'hindi') {
          setLanguage('hi');
          return;
      }

      if (type === 'bomb') {
          setBombTimer(4);
          setEasterEgg('bomb');
          return;
      }

      setEasterEgg(type);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard profile={profile} onNavigate={setCurrentScreen} onLogin={setProfile} language={language} />;
      case 'chat':
        return <ChatScreen profile={profile} language={language} messages={chatHistory} setMessages={setChatHistory} />;
      case 'emergency':
        return <Emergency profile={profile} language={language} onNavigate={setCurrentScreen} />;
      case 'credits':
        return <Credits onTriggerEasterEgg={handleEasterEggTrigger} language={language} />;
      case 'settings':
        return <Settings language={language} setLanguage={setLanguage} profile={profile} updateProfile={setProfile} onNavigate={setCurrentScreen} />;
      default:
        return <Dashboard profile={profile} onNavigate={setCurrentScreen} onLogin={setProfile} language={language} />;
    }
  };

  const toggleTheme = () => {
      setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden relative bg-surface dark:bg-black transition-colors duration-500`}>
      
      {/* Effect Overlays */}
      {easterEgg === 'bomb' && (
          <div className="bomb-overlay flex flex-col gap-4 !text-red-500">
             <div className="text-8xl animate-pulse">💣</div>
             <div className="text-[8rem] font-black font-mono leading-none">{bombTimer}</div>
          </div>
      )}
      {flash && <div className="flash-screen" />}
      {easterEgg === 'modal' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setEasterEgg('none')}>
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl text-center animate-bounce shadow-xl border border-gray-100 dark:border-neutral-800">
                  <h2 className="text-3xl font-bold text-primary dark:text-teal-400 mb-2">Thank You!</h2>
                  <p className="text-gray-600 dark:text-gray-300">From Developer Amalapurapu Praneeth Mohan</p>
              </div>
          </div>
      )}

      <NavigationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onSignOut={() => { setProfile(null); setIsDrawerOpen(false); }}
        profile={profile}
        language={language}
        onToggleTheme={toggleTheme}
        isDark={theme === 'dark'}
      />

      {/* Top Bar */}
      <header className="p-4 flex items-center justify-between z-10 bg-surface/80 dark:bg-black/80 backdrop-blur-md sticky top-0 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 transition"
            >
                <Menu size={24} className="text-gray-800 dark:text-white" />
            </button>
            <span className="font-bold text-lg text-primary hidden md:block">MediGuard AI</span>
        </div>
        
        {/* Theme Toggle (Top Right) */}
        <button 
            onClick={toggleTheme}
            className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-yellow-300 transition"
        >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
         <div className="h-full max-w-7xl mx-auto w-full">
            {renderScreen()}
         </div>
      </main>

      {/* Floating Chat Button (Bottom Right) */}
      {currentScreen !== 'chat' && (
        <button 
            onClick={() => setCurrentScreen('chat')}
            className="fixed bottom-6 right-6 z-30 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:scale-110 transition-transform active:scale-95"
        >
            <MessageSquare size={28} />
        </button>
      )}

    </div>
  );
};

export default App;
