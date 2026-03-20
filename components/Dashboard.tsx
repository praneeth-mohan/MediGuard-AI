import React, { useState, useEffect } from 'react';
import { UserProfile, AppScreen, Language, UI_TRANSLATIONS } from '../types';
import { ShieldCheck, UserPlus, Phone, AlertCircle, Download, Search, MessageSquare, Hand, X, WifiOff } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile | null;
  onNavigate: (screen: AppScreen) => void;
  onLogin: (p: UserProfile) => void;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate, onLogin, language }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '', email: '', age: '', gender: 'Unknown', 
    kidneyFunction: 'Normal', liverFunction: 'Normal', currentMeds: '', themeColor: '#006a6a'
  });
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [lastTap, setLastTap] = useState(0);
  const [showAvanthiModal, setShowAvanthiModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    const handleStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('online', handleStatus);
        window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.age) {
        setError("Name and Age are required.");
        return;
    }

    if (formData.gender === 'Unknown') {
        setError("Please select a gender.");
        return;
    }

    onLogin({
        ...formData as UserProfile,
        contacts: [{name: '', number: ''}, {name: '', number: ''}]
    });
    setShowLogin(false);
  };

  const handleDoubleTap = () => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (now - lastTap < DOUBLE_PRESS_DELAY) {
          setShowAvanthiModal(true);
      }
      setLastTap(now);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 pb-24 animate-fade-in h-full overflow-y-auto relative">
      
      {/* Introduction */}
      <div className="space-y-1 flex justify-between items-start">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-teal-400">MediGuard AI</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{t.subtitle}</p>
        </div>
        {deferredPrompt && (
            <button 
                onClick={handleInstallClick}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse"
            >
                <Download size={14} /> {t.install}
            </button>
        )}
      </div>

      {!isOnline && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 flex items-center gap-3 text-amber-800 dark:text-amber-200 text-sm font-medium">
              <WifiOff size={20} />
              <span>Offline Mode: Using built-in database only.</span>
          </div>
      )}

      {/* Hero Search Section - Clean Gradient */}
      <div className="bg-gradient-to-br from-primary to-teal-800 dark:from-neutral-900 dark:to-neutral-800 rounded-[32px] p-8 text-center text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 text-white shadow-inner transform rotate-3">
                <Search size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-xl md:text-3xl font-bold leading-tight mb-6 drop-shadow-md">
                {t.findMeds}
            </h2>

            <button 
                onClick={() => onNavigate('chat')}
                className="w-full max-w-xs bg-white text-primary dark:text-gray-900 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
                <MessageSquare size={20} />
                {t.enterSearch || "Start Search"}
            </button>
          </div>
      </div>

      {/* Member Access Widget */}
      {!profile ? (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 text-center shadow-sm max-w-2xl mx-auto">
           <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus size={24} className="text-gray-500 dark:text-gray-400" />
           </div>
           <h3 className="font-bold text-gray-800 dark:text-white mb-1">{t.join}</h3>
           <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t.joinSub}</p>
           <button 
             onClick={() => setShowLogin(true)}
             className="w-full md:w-auto md:px-12 bg-primary text-white py-3 rounded-full font-semibold shadow-lg shadow-primary/20 active:scale-95 transition"
           >
             {t.signIn}
           </button>
        </div>
      ) : (
         <div className="bg-primary/5 dark:bg-teal-900/10 border border-primary/10 dark:border-teal-800/30 rounded-3xl p-6 flex items-center justify-between max-w-2xl mx-auto">
            <div>
               <h3 className="font-bold text-primary dark:text-teal-300">{t.welcome}, {profile.name}</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">{t.profileActive} • {profile.age} {t.years}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm">
                <ShieldCheck className="text-green-500 dark:text-green-400" size={24} />
            </div>
         </div>
      )}

      {/* 24/7 Support */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-5 shadow-sm max-w-2xl mx-auto">
         <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-sm">{t.support}</h4>
         <div className="flex flex-col md:flex-row gap-3">
             <button 
                onClick={() => onNavigate('emergency')}
                className="flex-1 bg-gray-50 dark:bg-neutral-800 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
             >
                <Phone size={16} /> {t.callSupport}
             </button>
             {profile?.contacts[0]?.name && (
                 <button onClick={() => onNavigate('emergency')} className="flex-1 bg-red-50 dark:bg-red-900/20 py-3 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                    <AlertCircle size={16} /> {t.sos}: {profile.contacts[0].name}
                 </button>
             )}
         </div>
      </div>

      {/* Avanthi Institute Footer */}
      <div 
        onClick={handleDoubleTap}
        className="text-center py-6 select-none cursor-pointer active:scale-95 transition-transform"
      >
          <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase font-bold tracking-widest hover:text-primary transition-colors">
              {t.thanksAvanthi}
          </p>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-neutral-900 rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-fade-in border border-gray-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t.createProfile}</h2>
              {error && <p className="text-red-500 text-xs mb-3 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                 <input 
                    placeholder={t.fullName}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-lg md:text-sm text-gray-900 dark:text-white focus:ring-2 ring-primary"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                 />
                 <input 
                    placeholder={t.email}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-lg md:text-sm text-gray-900 dark:text-white focus:ring-2 ring-primary"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                 />
                 <div className="flex gap-3">
                    <div className="w-1/3">
                        <input 
                            placeholder={t.age}
                            type="text"
                            inputMode="numeric"
                            className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-lg md:text-sm text-gray-900 dark:text-white focus:ring-2 ring-primary"
                            value={formData.age}
                            onChange={e => setFormData({...formData, age: e.target.value})}
                            required
                        />
                    </div>
                    <select 
                        className={`flex-1 bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-lg md:text-sm focus:ring-2 ring-primary ${formData.gender === 'Unknown' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value as any})}
                    >
                        <option value="Unknown" disabled>Select Gender</option>
                        <option value="Male" className="text-gray-900">{t.male}</option>
                        <option value="Female" className="text-gray-900">{t.female}</option>
                        <option value="Other" className="text-gray-900">{t.other}</option>
                    </select>
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold active:scale-95 transition">{t.start}</button>
                    <button type="button" onClick={() => setShowLogin(false)} className="w-full mt-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm py-2">{t.cancel}</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Avanthi Appreciation Modal */}
      {showAvanthiModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowAvanthiModal(false)}>
              <div className="bg-white dark:bg-neutral-900 max-w-md w-full p-8 rounded-3xl shadow-2xl relative border border-gray-100 dark:border-neutral-800" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setShowAvanthiModal(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                  >
                      <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Hand size={40} className="text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.thankYouTitle}</h2>
                      <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                          {t.thankYouBody}
                      </p>
                      <div className="pt-4">
                          <span className="text-xs font-bold text-primary tracking-widest uppercase">MediGuard AI Team</span>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;