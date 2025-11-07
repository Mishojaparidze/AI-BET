import React, { useState, useRef, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import { type MatchPrediction } from '../types';

interface AiChatProps {
    predictions: MatchPrediction[];
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Icons
const ChatIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
    </svg>
);

const SendIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const XIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const BrainIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1.2a2.5 2.5 0 0 1 0 5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-2.5 2.5h-1.2a.5.5 0 0 0-.5.5v1.2a2.5 2.5 0 0 1-5 0v-1.2a.5.5 0 0 0-.5-.5H8.3a2.5 2.5 0 0 1-2.5-2.5v-1.2a.5.5 0 0 0-.5-.5H4.1a2.5 2.5 0 0 1 0-5h1.2a.5.5 0 0 0 .5-.5V8.3a2.5 2.5 0 0 1 2.5-2.5h1.2a.5.5 0 0 0 .5-.5V4.5A2.5 2.5 0 0 1 9.5 2z"/>
    </svg>
);


export const AiChat: React.FC<AiChatProps> = ({ predictions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm BetGenius AI. I can analyze all available matches for you. Try asking something like, 'Find me the high confidence bets with the best value.' to get started." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const newUserMessage: Message = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiResponse = await geminiService.getAiChatResponse(inputValue, predictions);
            const newAiMessage: Message = { role: 'assistant', content: aiResponse };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center p-4 bg-brand-green text-brand-bg-dark rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                    aria-label="Open AI Chat"
                >
                    <ChatIcon className="w-6 h-6" />
                </button>
            </div>
            {isOpen && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={() => setIsOpen(false)}>
                    <div className="bg-brand-bg-light w-full max-w-2xl h-[85vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                        <header className="p-4 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <BrainIcon className="w-6 h-6 text-brand-green" />
                                <h2 className="text-xl font-bold text-brand-text-primary">AI Chat Analyst</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-brand-border" aria-label="Close chat">
                                <XIcon className="w-5 h-5 text-brand-text-secondary"/>
                            </button>
                        </header>
                        
                        <main className="flex-grow p-4 overflow-y-auto">
                            <div className="space-y-6">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0"><BrainIcon className="w-5 h-5 text-brand-bg-dark"/></div>}
                                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-green text-brand-bg-dark' : 'bg-brand-bg-dark text-brand-text-primary'}`}>
                                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0"><BrainIcon className="w-5 h-5 text-brand-bg-dark"/></div>
                                        <div className="max-w-md p-3 rounded-lg bg-brand-bg-dark text-brand-text-primary">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 bg-brand-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-2 w-2 bg-brand-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-2 w-2 bg-brand-text-secondary rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </main>
                        
                        <footer className="p-4 border-t border-brand-border flex-shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about today's matches..."
                                    className="w-full bg-brand-bg-dark border border-brand-border rounded-lg py-2 px-4 focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
                                    disabled={isLoading}
                                />
                                <button type="submit" className="p-3 bg-brand-green text-brand-bg-dark rounded-lg disabled:bg-brand-border disabled:cursor-not-allowed" disabled={isLoading || !inputValue.trim()}>
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
};