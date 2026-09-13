import { useState, useRef, useEffect } from 'react';
import {
  X, Send, Sparkles, ChevronRight,
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

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello and Welcome! 👋\n\nI am **Agent54 AI Copilot** — your intelligent assistant for the VFSTR University Autonomous Compliance Platform.\n\nI am fully trained to explain every module and feature on this website:\n\n1. 🏠 **Home Overview**: Overall university score (35%), KPI metrics, & 6 Swarm Agents.\n2. 📑 **Regulations**: 26 statutory clauses (VFSTR R26, AICTE, UGC, NBA, NAAC).\n3. 🛡️ **Compliance**: Live audit verification engine across departments.\n4. ⚠️ **Risks**: Institutional Risk Matrix & penalty exposure.\n5. 📋 **Inspection Readiness**: Pre-Audit Dossier defense (27% readiness) & authority meters.\n6. 🛠️ **Remediation**: 19 active cases in Compliance Recovery Center.\n7. 🌐 **Inter-Agent Mesh**: Real-time telemetry between 7 swarm agents.\n8. ⚡ **Simulator**: "What-If" sandbox for faculty hires, intake, & budget scenarios.\n9. ⏱️ **Audit Trail**: Immutable cryptographic event ledger.\n10. 🔑 **Login & Manuals**: Security grid auth & custom PDF manual viewer/uploader.\n\nAsk me anything in **English** or any of the **22 Scheduled Indian Languages**!`,
      detectedLang: 'en',
      langName: '🌐 English (22 Langs Supported)',
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
      {/* Optional Floating Trigger Button */}
      {!hideDefaultTrigger && !isOpen && (
        <div className="fixed bottom-[110px] left-3 z-50 flex flex-col items-start gap-2 pointer-events-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white pl-3 pr-4 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/chatbot_avatar.png"
                  alt="Agent54 Bot"
                  className="w-7 h-7 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
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
        <div className="fixed bottom-6 left-4 lg:left-[272px] z-50 w-[92vw] sm:w-[450px] md:w-[490px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-4 flex flex-col gap-2 flex-shrink-0 shadow-md border-b border-blue-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center p-1 shadow-md">
                    <img
                      src="/chatbot_avatar.png"
                      alt="Agent54 Bot"
                      className="w-8 h-8 object-contain filter drop-shadow-md"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm tracking-wide text-white">Agent54 AI Copilot</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-[9px] font-extrabold text-emerald-200 uppercase tracking-wider">
                      22 Languages
                    </span>
                  </div>
                  <p className="text-[10.5px] font-semibold text-slate-300 mt-0.5">
                    Platform Knowledge Guide {activeTab ? `• Viewing ${activeTab}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'bot',
                      text: `Chat reset. I am ready to answer any questions about the platform, features, or how to navigate all 9 modules in 22 languages!`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])}
                  title="Reset Chat"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector Bar */}
            <div className="flex items-center justify-between bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold">
              <span className="text-[11px] text-blue-200 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-300" /> Response Language:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 focus:outline-none cursor-pointer max-w-[210px] truncate"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Area with Crisp High-Visibility Fonts */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden p-0.5">
                    <img
                      src="/chatbot_avatar.png"
                      alt="Agent54 Bot"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs font-bold'
                    : 'bg-white text-slate-900 border border-slate-300/90 rounded-tl-xs font-semibold'
                }`}>
                  {msg.sender === 'bot' && msg.langName && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        <span>🌐</span> {msg.langName}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-line text-slate-900 leading-relaxed tracking-normal font-medium text-xs sm:text-[13px]">
                    {msg.text}
                  </div>

                  {/* Direct Navigation Button */}
                  {msg.actionTab && onNavigateTab && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onNavigateTab(msg.actionTab!);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                      >
                        {msg.actionLabel || `Open ${msg.actionTab} Tab`}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-slate-500 font-bold">Click to jump directly</span>
                    </div>
                  )}

                  <div className={`text-[10px] mt-2 text-right font-extrabold ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            {[
              'What features are in this portal?',
              'Where is Inspection Readiness Dossier?',
              'How to use Simulator sandbox?',
              'How does Remediation Center work?',
              'Explain 26 statutory regulations',
              ' How to add custom PDF manual?'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(chip)}
                className="whitespace-nowrap px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-800 font-bold rounded-xl border border-slate-300 transition-all cursor-pointer flex-shrink-0 text-xs shadow-2xs"
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
              placeholder="Ask about features, navigation, or regulations..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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

