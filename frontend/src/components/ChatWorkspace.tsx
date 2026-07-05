'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Organization, Message } from '@/types';
import { BusinessOrchestrator } from '@/services/business-orchestrator';
import { 
  Sparkles, 
  Send, 
  User, 
  Cpu, 
  TrendingUp, 
  Target, 
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatWorkspaceProps {
  activeOrg: Organization;
  initialMessages?: Message[];
}

// Cycling status text during AI loading
const LOADING_STATUSES = [
  'Business Orchestrator: Initializing request...',
  'Analyzing executive request & industry sector...',
  'Loading business memory & context profile...',
  'Generating strategic recommendation blueprint...'
];

export default function ChatWorkspace({ activeOrg, initialMessages = [] }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Reset messages when organization changes
  useEffect(() => {
    setMessages([]);
  }, [activeOrg]);

  // Cycle status messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setStatusIndex(0);
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call BusinessOrchestrator abstraction
      const responseText = await BusinessOrchestrator.ask({
        organization: activeOrg,
        messages: [...messages, userMessage],
        prompt: textToSend
      });

      const assistantMessage: Message = {
        id: 'msg_' + Math.random().toString(36).substring(2, 11),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: 'msg_' + Math.random().toString(36).substring(2, 11),
        role: 'assistant',
        content: 'Failed to process strategic recommendation. Please check console.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  };

  // Preset suggestion chips
  const suggestions = [
    {
      title: 'Growth Strategy',
      text: 'Draft high-leverage strategic growth initiatives for our team this quarter.',
      icon: <TrendingUp size={14} className="text-orange-600" />
    },
    {
      title: 'Marketing Audit',
      text: 'Design a marketing blueprint to optimize customer acquisition and scale ad spend.',
      icon: <Target size={14} className="text-orange-600" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-white text-neutral-800 overflow-hidden relative">
      {/* Top ambient light */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      {/* Workspace Header */}
      <header className="h-16 border-b border-neutral-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-sm font-semibold text-neutral-700">
            {activeOrg.name} <span className="text-neutral-400 font-normal">/ Business Assistant</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-0.5 rounded-full font-mono uppercase">
            Model: Ollama (Gemma 4)
          </span>
        </div>
      </header>

      {/* Main Messages Scrollable Window */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10 bg-neutral-50/20">
        {messages.length === 0 ? (
          /* Empty Workspace Welcome Greeting */
          <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 shadow-md relative group">
              <Sparkles size={24} className="text-orange-600 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">
              {getGreeting()}
            </h2>
            <p className="text-neutral-500 text-sm mb-1 font-medium">
              Welcome to the **{activeOrg.name}** Business Workspace
            </p>
            <p className="text-neutral-400 text-xs mb-8">
              How can I assist your business growth and executive operations today?
            </p>

            {/* Suggestions layout */}
            <div className="grid sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.text)}
                  className="p-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all text-left group shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {sug.icon}
                    <span className="text-xs font-semibold text-neutral-700 group-hover:text-orange-600 transition-colors">
                      {sug.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed truncate">
                    {sug.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat History Logs */
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar Icon */}
                  {!isUser && (
                    <div className="h-8 w-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                      <Cpu size={14} className="text-orange-600" />
                    </div>
                  )}

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed border ${
                      isUser
                        ? 'bg-neutral-100 border-neutral-200/80 text-neutral-800'
                        : 'bg-white border-neutral-200/60 text-neutral-700 shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
                      <User size={14} className="text-neutral-500" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special Loading State for Business Orchestrator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8 w-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Loader2 size={14} className="text-orange-600 animate-spin" />
                </div>
                <div className="bg-white border border-neutral-200/60 rounded-2xl px-5 py-3.5 max-w-[85%] shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-widest font-mono">
                      Business Orchestrator
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 italic">
                    {LOADING_STATUSES[statusIndex]}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Form Panel */}
      <footer className="p-6 border-t border-neutral-100 bg-white/90 backdrop-blur-md relative z-10">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative"
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Query the executive assistant (e.g. Ask for strategy audit, growth KPIs, blueprints)..."
              className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-4 pr-14 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 resize-none max-h-32 custom-scrollbar shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-500 disabled:bg-neutral-50 disabled:text-neutral-300 transition-all shadow-[0_2px_10px_rgba(234,88,12,0.15)] active:scale-95"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-[10px] text-neutral-400 text-center font-mono uppercase tracking-wider">
              Savorit Business OS • Multi-Agent Interface Version 1
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponent to typewriter print & compile beautiful markdown outputs
function MarkdownRenderer({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState('');

  // Smooth typewriter simulation to emulate response streaming
  useEffect(() => {
    const words = content.split(' ');
    let currentText = '';
    let index = 0;

    const timer = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setDisplayedContent(currentText);
        index++;
      } else {
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [content]);

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h3 className="text-base font-bold text-neutral-800 mt-4 mb-2 first:mt-0">{children}</h3>,
        h2: ({ children }) => <h4 className="text-sm font-bold text-neutral-800 mt-4 mb-2 first:mt-0">{children}</h4>,
        h3: ({ children }) => <h5 className="text-xs font-bold text-neutral-800 mt-3 mb-1">{children}</h5>,
        p: ({ children }) => <p className="mb-3 last:mb-0 text-neutral-700 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-neutral-700">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-neutral-700">{children}</ol>,
        li: ({ children }) => <li className="text-xs">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-orange-500 pl-4 py-1 italic bg-orange-50/20 my-3 text-neutral-600 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code({ node: _node, className, children, ...props }) {
          // Check if block code or inline
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !content.includes('\n' + String(children));
          
          if (!isInline) {
            // Keep code blocks dark for a high-contrast developer workspace aesthetic
            return (
              <code 
                className={`${className || ''} block bg-neutral-900 p-4 rounded-xl border border-neutral-800/80 my-4 overflow-x-auto text-xs font-mono text-neutral-200 shadow-inner whitespace-pre`}
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-mono text-xs border border-orange-100" {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {displayedContent}
    </ReactMarkdown>
  );
}
