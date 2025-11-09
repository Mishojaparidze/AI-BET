import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);


export const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-brand-border rounded-lg overflow-hidden">
            <button 
                className="w-full flex justify-between items-center p-4 bg-brand-bg-dark hover:bg-brand-border/30 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-bold text-brand-text-primary">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-brand-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-brand-bg-light animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};
