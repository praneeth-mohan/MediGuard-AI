
import React from 'react';
import { ChatMessage } from '../types';
import { AlertTriangle, ExternalLink, ShoppingCart, User, Bot, Sparkles, Globe, AlertOctagon } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';

  const parseContent = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Buy Button Trigger
      const buyMatch = line.match(/\[BUY:(.*?)\]/);
      if (buyMatch) {
        const drugName = buyMatch[1];
        return (
          <div key={lineIndex} className="mt-4 mb-2 animate-fade-in">
            <a
              href={`https://www.1mg.com/search/all?name=${encodeURIComponent(drugName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ff6f61] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#e5635b] transition shadow-md w-full justify-center"
            >
              <ShoppingCart size={18} />
              Buy {drugName} on 1mg
            </a>
          </div>
        );
      }

      // Web Search Button Trigger (Offline Fallback & Supplement)
      const webMatch = line.match(/\[WEB:(.*?)\]/);
      if (webMatch) {
          const query = webMatch[1];
          return (
            <div key={lineIndex} className="mt-4 mb-2 animate-fade-in flex flex-col gap-2">
                <a
                href={`https://www.google.com/search?q=${encodeURIComponent(query + ' medication uses contraindication')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md w-full justify-center"
                >
                <Globe size={18} />
                Search Google (Uses & Contraindications)
                </a>
            </div>
          );
      }

      // Special Line Detection
      const isCriticalLine = line.trim().startsWith('CRITICAL:');
      const isWarningLine = line.trim().startsWith('WARNING:');
      let isSummaryLine = line.trim().startsWith('SUMMARY:');
      
      // Prepare content for parsing (Strip prefix if needed)
      let contentToParse = line;
      if (isSummaryLine) contentToParse = line.replace(/^SUMMARY:\s*/, '');
      if (isCriticalLine) contentToParse = line.replace(/^CRITICAL:\s*/, '');

      // Process [RED] tags (Bold Red Text) and **bold**
      const parts = contentToParse.split(/(\[RED\].*?\[\/RED\]|\*\*.*?\*\*)/g);

      const renderedLine = parts.map((part, partIndex) => {
        if (part.startsWith('[RED]') && part.endsWith('[/RED]')) {
          const content = part.replace('[RED]', '').replace('[/RED]', '');
          return (
            <span key={partIndex} className="text-red-600 font-black tracking-wide">
              {content}
            </span>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIndex}>{part.replace(/\*\*/g, '')}</strong>
        }
        return <span key={partIndex}>{part}</span>;
      });

      if (isCriticalLine) {
        return (
          <div key={lineIndex} className="bg-red-100 border-l-4 border-red-600 p-4 my-3 rounded-r-lg text-red-900 font-bold flex items-start gap-3 shadow-md animate-pulse-slow">
            <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5 text-red-700" />
            <div className="leading-relaxed text-base">{renderedLine}</div>
          </div>
        );
      }

      if (isWarningLine) {
        return (
          <div key={lineIndex} className="bg-orange-50 border-l-4 border-orange-500 p-3 my-2 rounded-r-lg text-orange-900 text-sm font-medium flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-orange-600" />
            <div className="leading-relaxed">{renderedLine}</div>
          </div>
        );
      }

      if (isSummaryLine) {
          return (
             <div key={lineIndex} className="mt-4 mb-4 p-5 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 border border-teal-100 dark:border-teal-800 rounded-2xl text-teal-900 dark:text-teal-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={64} />
                 </div>
                 <div className="flex gap-3 relative z-10">
                    <Sparkles className="w-6 h-6 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                    <div className="leading-relaxed font-medium text-base">{renderedLine}</div>
                 </div>
             </div> 
          )
      }

      if (line.trim().length === 0) return <br key={lineIndex} />;
      
      // Bullet points
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•');

      return (
        <p key={lineIndex} className={`mb-1.5 leading-relaxed ${isBullet ? 'pl-4 relative' : ''}`}>
          {isBullet && <span className="absolute left-0 text-gray-400">•</span>}
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] gap-1 ${isModel ? 'items-start' : 'items-end'}`}>
        
        <div className={`flex gap-3 ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isModel ? 'bg-primary text-white' : 'bg-gray-800 dark:bg-gray-700 text-white'}`}>
            {isModel ? <Bot size={18} /> : <User size={18} />}
            </div>

            <div className="flex flex-col">
                {/* Image Preview in History */}
                {message.image && (
                    <div className="mb-2 w-48 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-sm">
                        <img src={message.image} className="w-full h-full object-cover" alt="User upload" />
                    </div>
                )}
                
                {/* Text Bubble */}
                {message.text && (
                    <div
                        className={`p-4 rounded-[20px] shadow-sm text-sm md:text-base ${
                        isModel
                            ? 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-neutral-700'
                            : 'bg-primary text-white rounded-tr-none'
                        }`}
                    >
                        {parseContent(message.text)}
                    </div>
                )}
            </div>
        </div>

        <span className="text-[10px] text-gray-400 px-12 opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

      </div>
    </div>
  );
};

export default MessageBubble;