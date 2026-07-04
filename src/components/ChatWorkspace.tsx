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
      icon: <TrendingUp size={14} className="text-blue-400" />
    },
    {
      title: 'Marketing Audit',
      text: 'Design a marketing blueprint to optimize customer acquisition and scale ad spend.',
      icon: <Target size={14} className="text-indigo-400" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-neutral-950 text-neutral-200 overflow-hidden relative">
      {/* Top ambient lights */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

      {/* Workspace Header */}
      <header className="h-16 border-b border-neutral-900 px-6 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-sm font-semibold text-neutral-300">
            {activeOrg.name} <span className="text-neutral-500 font-normal">/ Business Assistant</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full font-mono uppercase">
            Model: Gemini-3.5-Flash
          </span>
        </div>
      </header>

      {/* Main Messages Scrollable Window */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
        {messages.length === 0 ? (
          /* Empty Workspace Welcome Greeting */
          <div className="max-w-2xl mx-auto pt-16 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-xl relative group">
              <Sparkles size={24} className="text-blue-400 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-neutral-100 mb-2">
              {getGreeting()}
            </h2>
            <p className="text-neutral-400 text-sm mb-1">
              Welcome to the **{activeOrg.name}** Business Workspace
            </p>
            <p className="text-neutral-500 text-xs mb-8">
              How can I assist your business growth and executive operations today?
            </p>

            {/* Suggestions layout */}
            <div className="grid sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.text)}
                  className="p-4 rounded-xl border border-neutral-900 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-800 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {sug.icon}
                    <span className="text-xs font-semibold text-neutral-300 group-hover:text-blue-400 transition-colors">
                      {sug.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed truncate">
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
                    <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Cpu size={14} className="text-blue-400" />
                    </div>
                  )}

                  {/* Message Bubble Card */}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed border ${
                      isUser
                        ? 'bg-neutral-900/80 border-neutral-800/60 text-neutral-100'
                        : 'bg-neutral-900/35 border-neutral-900 text-neutral-300'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}
                  </div>

                  {isUser && (
                    <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                      <User size={14} className="text-neutral-400" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special Loading State for Business Orchestrator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="h-8 w-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Loader2 size={14} className="text-blue-400 animate-spin" />
                </div>
                <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl px-5 py-3.5 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest font-mono">
                      Business Orchestrator
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 italic">
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
      <footer className="p-6 border-t border-neutral-900 bg-neutral-950/90 backdrop-blur-md relative z-10">
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
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 py-4 pl-4 pr-14 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none max-h-32 custom-scrollbar transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-neutral-900 disabled:text-neutral-600 transition-all shadow-[0_0_10px_rgba(59,130,246,0.15)] active:scale-95"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-[10px] text-neutral-600 text-center font-mono uppercase tracking-wider">
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
        h1: ({ children }) => <h3 className="text-base font-bold text-neutral-100 mt-4 mb-2 first:mt-0">{children}</h3>,
        h2: ({ children }) => <h4 className="text-sm font-bold text-neutral-200 mt-4 mb-2 first:mt-0">{children}</h4>,
        h3: ({ children }) => <h5 className="text-xs font-bold text-neutral-300 mt-3 mb-1">{children}</h5>,
        p: ({ children }) => <p className="mb-3 last:mb-0 text-neutral-300">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-neutral-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-neutral-300">{children}</ol>,
        li: ({ children }) => <li className="text-xs">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-blue-500 pl-4 py-1 italic bg-neutral-950/20 my-3 text-neutral-400 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code({ node: _node, className, children, ...props }) {
          // Check if block code or inline
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !content.includes('\n' + String(children));
          
          if (!isInline) {
            return (
              <code 
                className={`${className || ''} block bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 my-4 overflow-x-auto text-xs font-mono text-neutral-300 shadow-inner whitespace-pre`}
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className="bg-neutral-900/80 text-blue-300 px-1.5 py-0.5 rounded font-mono text-xs border border-neutral-800/40" {...props}>
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
