import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIResponse } from '../../utils/aiEngine';

export const AIChatDrawer: React.FC = () => {
  const {
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    transactions,
    budgets,
    goals,
    subscriptions,
    currency,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: 'Ask me anything about your ledger or cash velocity.' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(
        userText,
        transactions,
        budgets,
        goals,
        subscriptions,
        currency
      );
      setMessages(prev => [...prev, { sender: 'assistant', text: response.text }]);
      setLoading(false);
    }, 400);
  };

  if (!isChatDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        <div
          onClick={() => setIsChatDrawerOpen(false)}
          className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#FCFBF8] border-l border-[#E6E2D8] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E6E2D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF56D] text-[#111111] flex items-center justify-center font-black">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#111111]">Aura Copilot</h3>
                <p className="text-[10px] text-[#666666]">Autonomous Financial Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsChatDrawerOpen(false)}
              className="p-2 rounded-2xl text-[#666666] hover:text-[#111111] hover:bg-[#F0EDE4]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'ml-auto bg-[#111111] text-[#FCFBF8] max-w-[85%] font-medium'
                    : 'bg-[#F7F5F0] text-[#111111] border border-[#E6E2D8] max-w-[90%]'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="p-3 rounded-2xl bg-[#F7F5F0] text-[#111111] text-xs flex items-center gap-2 border border-[#E6E2D8] w-32 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#111111]" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#E6E2D8] bg-[#FCFBF8] flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 aura-input"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-2xl bg-[#111111] hover:bg-[#262626] text-[#FCFBF8] font-bold disabled:opacity-40 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
