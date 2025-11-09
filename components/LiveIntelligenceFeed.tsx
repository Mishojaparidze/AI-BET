import React from 'react';
import { type DataSource, DataSourceStatus } from '../types';

// Icons
const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);
const DollarSignIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const NewspaperIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4M4 9h16M4 15h16M10 3v18"/></svg>
);
const CloudIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
);
const BriefcaseMedicalIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11v4"/><path d="M14 13h-4"/><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const getCategoryIcon = (category: string) => {
    const iconClass = "w-5 h-5 text-brand-text-secondary";
    if (category.toLowerCase().includes('stat')) return <ChartBarIcon className={iconClass} />;
    if (category.toLowerCase().includes('odds')) return <DollarSignIcon className={iconClass} />;
    if (category.toLowerCase().includes('news') || category.toLowerCase().includes('social')) return <NewspaperIcon className={iconClass} />;
    if (category.toLowerCase().includes('weather') || category.toLowerCase().includes('contextual')) return <CloudIcon className={iconClass} />;
    if (category.toLowerCase().includes('injury')) return <BriefcaseMedicalIcon className={iconClass} />;
    return <UsersIcon className={iconClass}/>;
}

const DataSourceItem: React.FC<{source: DataSource}> = ({ source }) => {
    const statusConfig = {
        [DataSourceStatus.Live]: 'bg-brand-green/20 text-brand-green border-brand-green/30',
        [DataSourceStatus.PreMatch]: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        [DataSourceStatus.Error]: 'bg-brand-red/20 text-brand-red border-brand-red/30',
    }
    return (
        <div className="bg-brand-bg-light p-4 rounded-lg border border-brand-border">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    {getCategoryIcon(source.category)}
                    <div>
                        <p className="font-bold text-brand-text-primary">{source.category}</p>
                        <p className="text-xs text-brand-text-secondary">Provider: {source.provider}</p>
                    </div>
                </div>
                <div className={`px-2 py-0.5 text-xs font-bold rounded-full border ${statusConfig[source.status]}`}>
                    {source.status}
                </div>
            </div>
            <ul className="space-y-2 text-sm">
                {source.metrics.map(metric => (
                    <li key={metric.name} className="flex justify-between border-t border-brand-border/50 pt-2">
                        <span className="text-brand-text-secondary">{metric.name}</span>
                        <span className="font-mono font-semibold text-brand-text-primary">{metric.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

interface LiveIntelligenceFeedProps {
    sources: readonly DataSource[];
}

export const LiveIntelligenceFeed: React.FC<LiveIntelligenceFeedProps> = ({ sources }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map(source => <DataSourceItem key={`${source.provider}-${source.category}`} source={source} />)}
        </div>
    );
};