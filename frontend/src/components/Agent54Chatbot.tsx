import { useState, useRef, useEffect } from 'react';
import {
  X, Send, Bot, Sparkles, ChevronRight,
  RotateCcw, Globe
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  generateMultilingualBotReply
} from './multilingualBotEngine';

interface ChatbotProps {
  onNavigateTab?: (tabId: string) => void;
  activeTab?: string;
  dashboardData?: any;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideDefaultTrigger?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  actionTab?: string;
  actionLabel?: string;
  timestamp: string;
  detectedLang?: string;
  langName?: string;
}

export default function Agent54Chatbot({
  onNavigateTab,
  activeTab,
  dashboardData,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideDefaultTrigger = false
}: ChatbotProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) {
      onOpenChange(val);
    } else {
      setInternalOpen(val);
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Namaste / Welcome / నమస్కారం!\n\nMai **Agent54 AI Copilot** hu. Mai **22 Indian Scheduled Languages** (Telugu, Tamil, Hindi, Bengali, Marathi, Gujarati, etc.) aur **Hinglish** dono me train hu.\n\nAap mujhse kisi bhi bhasha me pooch sakte hain ki **kaun sa feature kahan hai**, **kaise kaam karta hai**, ya direct tab par navigate kar sakte hain!`,
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish + 22 Languages',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Multilingual AI reasoning and native response
    setTimeout(() => {
      const reply = generateMultilingualBotReply(userText, selectedLanguage, activeTab, dashboardData);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        actionTab: reply.actionTab,
        actionLabel: reply.actionLabel,
        detectedLang: reply.detectedLang,
        langName: reply.langName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 250);
  };

  const handleQuickQuestion = (qText: string) => {
    setInputMessage(qText);
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: qText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      const reply = generateMultilingualBotReply(qText, selectedLanguage, activeTab, dashboardData);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply.text,
        actionTab: reply.actionTab,
        actionLabel: reply.actionLabel,
        detectedLang: reply.detectedLang,
        langName: reply.langName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 100);
  };

  return (
    <>
      {/* Optional Floating Trigger Button if not placed in sidebar */}
      {!hideDefaultTrigger && !isOpen && (
        <div className="fixed bottom-[110px] left-3 z-50 flex flex-col items-start gap-2 pointer-events-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white pl-3.5 pr-4 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div className="text-left">
              <p className="text-xs font-black tracking-wide leading-none flex items-center gap-1">
                Ask Agent54 AI <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              </p>
              <p className="text-[10px] text-blue-100 font-medium leading-tight mt-0.5">Platform Copilot (22 Langs)</p>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Modal on Left Side */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 lg:left-[272px] z-50 w-[92vw] sm:w-[430px] md:w-[470px] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-3.5 flex flex-col gap-2 flex-shrink-0 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-xs tracking-wide text-white">Agent54 AI Copilot</h3>
                    <span className="px-1.5 py-0.5 bg-emerald-500/30 border border-emerald-400/40 rounded text-[8px] font-black text-emerald-200 uppercase tracking-wider">
                      22 Langs + Hinglish
                    </span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-300">
                    Multilingual Autonomous Guide {activeTab ? `• Viewing ${activeTab}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'bot',
                      text: `Chat reset ho gaya hai. Aap mujhse kisi bhi bhasha (Hindi, Hinglish, Telugu, Tamil, Bengali, Marathi, English, etc.) me platform ke bare me pooch sakte hain!`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])}
                  title="Reset Chat"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector Bar */}
            <div className="flex items-center justify-between bg-white/10 px-2.5 py-1 rounded-xl border border-white/15 text-[10px]">
              <span className="text-[10px] text-blue-200 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-300" /> Language Mode:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20 focus:outline-none cursor-pointer max-w-[190px] truncate"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs font-semibold'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}>
                  {msg.sender === 'bot' && msg.langName && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                        <span>🌐</span> {msg.langName}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Direct Navigation Button if generated */}
                  {msg.actionTab && onNavigateTab && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onNavigateTab(msg.actionTab!);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-blue-200 transition-all cursor-pointer shadow-2xs"
                      >
                        {msg.actionLabel || `Open ${msg.actionTab} Tab`}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[9px] text-slate-400 font-medium">Click to navigate</span>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 text-right font-medium ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {[
              'Kaun sa feature kahan hai?',
              'సంసిద్ధత డోసియర్ ఎలా ఉంది?',
              'निरीक्षण तत्परता क्या है?',
              'Simulator What-If sandbox',
              'Remediation Center kaise kaam karta hai?'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(chip)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold rounded-lg border border-slate-200/60 transition-all cursor-pointer flex-shrink-0 text-[10px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Ask in Hindi, Hinglish, Telugu, Tamil, English, etc..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/20 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
