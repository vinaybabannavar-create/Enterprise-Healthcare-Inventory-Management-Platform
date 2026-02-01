'use client';

import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '@/lib/api';

interface Message {
    text: string;
    isAI: boolean;
    timestamp: Date;
}

const AIAssistant = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I'm your HealthStock AI. How can I help you manage your inventory today?", isAI: true, timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const askAI = async (question: string) => {
        if (!question.trim()) return;

        setMessages(prev => [...prev, { text: question, isAI: false, timestamp: new Date() }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('ai/query/', { question });
            setMessages(prev => [...prev, {
                text: response.data.answer,
                isAI: true,
                timestamp: new Date()
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                text: "I'm sorry, I'm having trouble connecting to the medical data core.",
                isAI: true,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">AI Inventory Assistant</h3>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex items-start gap-2 max-w-[85%] ${msg.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${msg.isAI ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                {msg.isAI ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${msg.isAI ? 'bg-slate-50 text-slate-900 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 p-3 rounded-2xl flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {["Low stock items?", "Expiring soon?"].map((q) => (
                    <button
                        key={q}
                        onClick={() => askAI(q)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 px-2 rounded-lg transition-colors border border-slate-200"
                    >
                        {q}
                    </button>
                ))}
            </div>

            <form
                onSubmit={(e) => { e.preventDefault(); askAI(input); }}
                className="relative"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI about inventory..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default AIAssistant;
