import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { generateAIResponse, AIMessage } from '../../utils/aiEngine';

export const AIAssistantView: React.FC = () => {
  const { transactions, budgets, goals, subscriptions, currency } = useApp();
  const { user } = useAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}, I am your Aura Financial Copilot. Ask me anything about your cash burn, subscription audits, or 1-year wealth projections.`,
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(
        query,
        transactions,
        budgets,
        goals,
        subscriptions,
        currency
      );

      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 450);
  };

  const quickPrompts = [
    'How much did I spend this month?',
    'What is my projected 1-year net worth?',
    'Audit my recurring subscriptions',
    'How fast am I burning my budget?',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
            Heuristic Advisor
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
            Realtime Synthesis
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Aura AI Financial Copilot
        </h1>
        <p className="text-xs text-[#111111]/70 mt-1">
          Heuristic advisor parsing your transactions, subscriptions, and savings goals in real-time.
        </p>
      </div>

      {/* Chat Container */}
      <div className="rounded-[22px] bg-[#FCFBF8] border border-[#111111]/10 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#111111] text-[#FCFBF8]'
                    : 'bg-[#EAF56D] text-[#111111]'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-3xl max-w-lg text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#111111] text-[#FCFBF8] font-medium'
                    : 'bg-[#F7F5F0] text-[#111111] border border-[#111111]/10'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-white/60' : 'text-[#111111]/50'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F7F5F0] border border-[#111111]/10 w-36 text-xs text-[#111111]/70 font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#111111]" />
              <span>Analyzing ledger...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-6 py-3 border-t border-[#111111]/10 bg-[#F7F5F0]/60 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1.5 rounded-xl bg-[#FCFBF8] hover:bg-[#111111] hover:text-[#FCFBF8] text-[#111111] text-[11px] font-semibold border border-[#111111]/10 whitespace-nowrap transition-all shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-[#111111]/10 bg-[#FCFBF8]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Aura AI about your expenses, budgets, or net worth..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 aura-input"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-3 rounded-2xl bg-[#111111] hover:bg-[#222222] text-[#FCFBF8] font-bold disabled:opacity-40 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
