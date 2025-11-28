import React from 'react';
import { NewsItem } from '../types';
import { Calendar, Tag, Bookmark, ArrowRight, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const getSourceColor = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('google')) return 'text-blue-400 bg-blue-950/50 border-blue-800/50';
    if (s.includes('semrush')) return 'text-orange-400 bg-orange-950/50 border-orange-800/50';
    if (s.includes('ahrefs')) return 'text-indigo-400 bg-indigo-950/50 border-indigo-800/50';
    if (s.includes('moz')) return 'text-yellow-400 bg-yellow-950/50 border-yellow-800/50';
    if (s.includes('search engine')) return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  return (
    <div className="group relative flex flex-col justify-between p-6 md:p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border uppercase ${getSourceColor(item.source)}`}>
            {item.source}
          </span>
          <div className="flex items-center gap-3">
             <span className="flex items-center text-xs text-slate-500 font-medium">
                <Calendar size={14} className="mr-1.5" /> {item.date}
            </span>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-4 leading-relaxed group-hover:text-blue-400 transition-colors">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>

        <p className="text-slate-300 text-base md:text-lg mb-8 leading-8 font-light tracking-wide">
          {item.summary}
        </p>
      </div>

      <div className="mt-auto border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/50">
                    <Tag size={12} className="mr-1.5 opacity-60" /> {tag}
                </span>
            ))}
        </div>
        
        {item.url ? (
                <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 group/btn shrink-0"
            >
                Read Source <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </a>
        ) : (
            <span className="text-slate-600 text-sm italic">Source unavailable</span>
        )}
      </div>
    </div>
  );
};