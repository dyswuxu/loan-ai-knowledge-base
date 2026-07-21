'use client';

import { useState, useRef, useEffect } from 'react';

const quickQuestions = [
  '小微企业、有房产抵押，最高能贷多少？',
  '找建设银行有哪些贷款产品？',
  '帮我分析一下这家企业的风控情况',
  '哪些产品适合商贸行业的企业？',
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是贷款AI助手，基于真实的大语言模型。\n\n您可以问我关于贷款产品、企业分析、风控评估等问题。\n\n比如：\n• "小微企业有房产能贷多少"\n• "建设银行有什么信用贷产品"\n• "帮我分析这家企业的风险"\n• "商贸行业申请贷款有什么技巧"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // 收集历史消息用于上下文
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: text,
          history: history
        }),
      });
      
      if (!res.ok) {
        throw new Error('API request failed');
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '抱歉，我暂时无法回答这个问题。' }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('网络错误，请稍后重试');
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，AI服务暂时不可用。请稍后重试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI 对话</h1>
        <p className="text-slate-400 mt-1">🤖 基于大语言模型 · 支持上下文理解 · 自然语言交互</p>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-slate-800 rounded-xl shadow-sm border border-slate-700 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              }`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">🤖</div>
              <div className="bg-slate-700 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">!</div>
              <div className="bg-red-900/50 border border-red-800 rounded-xl px-4 py-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-500 mb-2">快捷问题（点击发送）</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q)} 
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入您的问题，按 Enter 发送..."
              className="flex-1 px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
