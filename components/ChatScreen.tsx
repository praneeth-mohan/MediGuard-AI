
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip, Trash2, ChevronRight, X, Edit3 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { UserProfile, ChatMessage, Language, UI_TRANSLATIONS } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatScreenProps {
  profile: UserProfile | null;
  language: Language;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ profile, language, messages, setMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  // Initial Greeting (only if empty)
  useEffect(() => {
    if (!initializedRef.current && messages.length === 0) {
        setMessages([{
            id: 'init',
            role: 'model',
            text: profile 
              ? `${t.welcome} ${profile.name}. ${t.profileActive} (${t.age}: ${profile.age}). ${t.typeQuery}`
              : `${t.welcome}. ${t.typeQuery}`,
            timestamp: new Date(),
        }]);
        initializedRef.current = true;
    }
  }, [profile, messages.length, setMessages, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage)) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(userMsg.text, messages, profile || {} as any, language);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        groundingSources: response.groundingSources
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
       // Error handled
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-surface dark:bg-black relative overflow-hidden transition-colors duration-500">
      
      {/* Profile Sidebar (Desktop/Mobile Toggle) */}
      <div className={`absolute inset-y-0 right-0 w-64 bg-white dark:bg-neutral-900 shadow-2xl z-20 transform transition-transform duration-300 border-l border-gray-100 dark:border-neutral-800 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 dark:text-gray-200">{t.medicalProfile}</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-4 text-sm">
             {profile ? (
                 <>
                   <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                       <span className="text-xs text-gray-400 block">{t.age}</span>
                       <span className="font-medium dark:text-gray-200">{profile.age} {t.years}</span>
                   </div>
                   <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                       <span className="text-xs text-gray-400 block">{t.kidneyFunction}</span>
                       <span className="font-medium dark:text-gray-200">{profile.kidneyFunction}</span>
                   </div>
                   <div className="bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                       <span className="text-xs text-gray-400 block">{t.currentMeds}</span>
                       <span className="font-medium dark:text-gray-200">{profile.currentMeds || "None"}</span>
                   </div>
                   <button className="w-full py-2 text-primary dark:text-teal-400 text-xs font-bold border border-primary/20 dark:border-teal-500/30 rounded-lg hover:bg-primary/5 dark:hover:bg-teal-500/10">{t.editProfile}</button>
                 </>
             ) : (
                 <p className="text-gray-500 italic">No profile loaded.</p>
             )}
          </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col h-full relative">
          
          {/* Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
               <button onClick={() => setMessages([])} className="p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur rounded-full text-red-500 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16} /></button>
               <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur rounded-full text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700"><Edit3 size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
            <div className="flex justify-start w-full">
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 px-5 py-4 rounded-[24px] rounded-tl-none shadow-sm">
                <Loader2 className="w-5 h-5 text-primary dark:text-teal-400 animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t.analyzing}</span>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 w-full p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-100 dark:border-neutral-800 transition-colors duration-300">
             <div className="max-w-3xl mx-auto">
                 {selectedImage && (
                     <div className="mb-2 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                         <img src={selectedImage} className="object-cover w-full h-full" alt="preview" />
                         <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5"><X size={12} /></button>
                     </div>
                 )}
                 <div className="flex items-center gap-2">
                     <label className="p-3 text-gray-400 hover:text-primary dark:hover:text-teal-400 cursor-pointer transition">
                         <Paperclip size={24} />
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                     <div className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-[24px] flex items-center px-4 py-2 border border-transparent focus-within:border-primary dark:focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-primary/10 dark:focus-within:ring-teal-500/20 transition">
                         <input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={t.typeQuery}
                            className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 h-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                         />
                     </div>
                     <button
                        onClick={handleSendMessage}
                        disabled={(!inputText.trim() && !selectedImage) || isLoading}
                        className="p-3 bg-primary dark:bg-teal-600 text-white rounded-full shadow-lg hover:bg-primary/90 dark:hover:bg-teal-500 disabled:bg-gray-300 dark:disabled:bg-neutral-700 disabled:shadow-none transition transform active:scale-95"
                     >
                        <Send size={20} />
                     </button>
                 </div>
             </div>
          </div>
      </div>

    </div>
  );
};

export default ChatScreen;
