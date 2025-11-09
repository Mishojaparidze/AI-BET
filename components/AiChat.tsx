import React, { useState, useRef, useEffect } from 'react';
import { getAiChatResponse } from '../services/geminiService';
import { MatchPrediction } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface AiChatProps {
    contextualPredictions: MatchPrediction[];
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export const AiChat: React.FC<AiChatProps> = ({ contextualPredictions }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm your AI Analyst. Ask me anything about today's matches, like 'Which match has the highest EV?' or 'Find me a confident bet in the Premier League'." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAiChatResponse(input, contextualPredictions);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-lg shadow-lg h-[600px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-green flex-shrink-0"></div>}
                        <div className={`max-w-lg p-4 rounded-lg ${msg.sender === 'ai' ? 'bg-brand-bg-dark text-brand-text-primary' : 'bg-brand-green text-white'}`}>
                           <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}></div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-green flex-shrink-0"></div>
                        <div className="max-w-lg p-4 rounded-lg bg-brand-bg-dark text-brand-text-primary">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-brand-border bg-brand-bg-dark/50 rounded-b-lg">
                <div className="relative">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the AI Analyst..."
                        disabled={isLoading}
                        className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-3 pl-4 pr-12 text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-brand-green disabled:opacity-50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || input.trim() === ''}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-brand-text-secondary hover:text-brand-green disabled:text-gray-500 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};