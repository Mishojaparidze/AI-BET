
import React, { useState, useRef, useEffect } from 'react';
import { streamAiChatResponse } from '../services/geminiService';
import { useStore } from '../store/useStore';

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const StopIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" /></svg>
);

const RobotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

interface Message {
    sender: 'user' | 'ai';
    text: string;
    isStreaming?: boolean;
}

export const AiChat: React.FC = () => {
    const { liveMatches, filteredPredictions, bankroll, userBets } = useStore(state => ({
        liveMatches: state.liveMatches,
        filteredPredictions: state.getFilteredPredictions(),
        bankroll: state.bankroll,
        userBets: state.userBets
    }));

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "I'm **BetGenius**. I see your bankroll and today's lines. What's the play?" }
    ]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreaming]);

    const handleSend = async () => {
        if (input.trim() === '' || isStreaming) return;

        const userMessageText = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMessageText }]);
        setInput('');
        setIsStreaming(true);

        // Add placeholder for AI response
        setMessages(prev => [...prev, { sender: 'ai', text: '', isStreaming: true }]);

        try {
            // Pass full context to the service
            const stream = streamAiChatResponse(userMessageText, {
                predictions: filteredPredictions,
                liveMatches: liveMatches,
                bankroll: bankroll,
                userBets: userBets
            });
            
            let fullResponse = "";
            
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === 'ai') {
                        lastMessage.text = fullResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "**System Error:** I lost connection to the odds feed." }]);
        } finally {
            setIsStreaming(false);
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0) {
                    newMessages[newMessages.length - 1].isStreaming = false;
                }
                return newMessages;
            });
        }
    };

    return (
        <div className="bg-brand-bg-light border border-brand-border rounded-lg shadow-lg h-[600px] flex flex-col relative overflow-hidden">
            {/* Chat Header */}
            <div className="bg-brand-bg-dark/50 p-3 border-b border-brand-border flex items-center gap-2">
                <div className="relative">
                    <div className="w-2 h-2 bg-brand-green rounded-full absolute top-0 right-0 animate-pulse"></div>
                    <RobotIcon className="w-5 h-5 text-brand-text-primary"/>
                </div>
                <span className="text-xs font-bold text-brand-text-secondary tracking-widest uppercase">Live Analyst Connected</span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''} animate-fade-in`}>
                        {msg.sender === 'ai' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.isStreaming ? 'bg-brand-green animate-pulse' : 'bg-brand-bg-dark border border-brand-green/50'}`}>
                                <RobotIcon className={`w-5 h-5 ${msg.isStreaming ? 'text-white' : 'text-brand-green'}`} />
                            </div>
                        )}
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                            msg.sender === 'ai' 
                            ? 'bg-brand-bg-dark text-brand-text-primary rounded-tl-none border border-brand-border' 
                            : 'bg-gradient-to-br from-brand-green to-emerald-700 text-white rounded-tr-none shadow-emerald-900/20'
                        }`}>
                           <div 
                                className="prose prose-sm prose-invert max-w-none break-words" 
                                dangerouslySetInnerHTML={{
                                    __html: msg.text
                                        .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-brand-yellow">$1</span>') // Highlight bold items
                                        .replace(/\n/g, '<br />')
                                }} 
                           />
                           {msg.isStreaming && (
                               <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-brand-green animate-pulse"></span>
                           )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-brand-border bg-brand-bg-dark/80 backdrop-blur-md">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isStreaming ? "Analyzing..." : "Ask about EV, bankroll, or specific matches..."}
                        disabled={isStreaming}
                        className="w-full bg-brand-bg-light border border-brand-border rounded-full py-3.5 pl-5 pr-14 text-brand-text-primary focus:ring-2 focus:ring-brand-green focus:border-transparent shadow-inner transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder-brand-text-secondary/50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isStreaming || input.trim() === ''}
                        className={`absolute right-2 p-2 rounded-full transition-all duration-200 ${
                            input.trim() !== '' && !isStreaming
                            ? 'bg-brand-green text-white shadow-lg transform hover:scale-105 active:scale-95' 
                            : 'bg-transparent text-brand-text-secondary cursor-default'
                        }`}
                        aria-label="Send message"
                    >
                        {isStreaming ? <StopIcon className="w-5 h-5 animate-pulse text-brand-red" /> : <SendIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
