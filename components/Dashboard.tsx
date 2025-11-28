import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { NewsItem, GroundingSource } from '../types';
import { NewsCard } from './NewsCard';
import { RefreshCw, ExternalLink, Zap, Globe, Database } from 'lucide-react';

interface DashboardProps {
  feedState: {
    items: NewsItem[];
    groundingSources: GroundingSource[];
    lastUpdated: Date | null;
    isLoading: boolean;
    error: string | null;
  };
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ feedState, onRefresh }) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Market Overview</h2>
          <p className="text-slate-400 text-base">Real-time insights from across the SEO & Digital Marketing landscape.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={feedState.isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <RefreshCw size={20} className={feedState.isLoading ? 'animate-spin' : ''} />
          {feedState.isLoading ? 'Analyzing Web...' : 'Refresh Feed'}
        </button>
      </div>

      {/* Stats & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Radar Chart */}
        <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 flex flex-col items-center shadow-sm">
            <h3 className="text-slate-200 font-semibold mb-6 w-full text-left flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" /> Topic Volatility
            </h3>
            <div className="w-full h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MOCK_CHART_DATA}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Volatility"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                        itemStyle={{ color: '#60a5fa' }}
                    />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center px-4">
              Real-time analysis of keyword volatility and algorithm flux indicators.
            </p>
        </div>

        {/* Quick Stats & References Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Globe size={64} />
                  </div>
                  <div className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Sources Monitored</div>
                  <div className="text-4xl font-bold text-white mb-4">12+</div>
                  <div className="flex flex-wrap gap-2 relative z-10">
                      {['Google', 'Ahrefs', 'Semrush', 'Moz'].map(s => (
                          <span key={s} className="px-2.5 py-1 bg-slate-800/80 backdrop-blur rounded-md text-xs font-medium text-slate-300 border border-slate-600/50">{s}</span>
                      ))}
                  </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database size={64} />
                  </div>
                  <div className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Updates Found</div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">
                      {feedState.items.length > 0 ? feedState.items.length : '--'}
                  </div>
                  <div className="text-sm text-slate-500">
                      Last synced: <span className="text-slate-300">{feedState.lastUpdated ? feedState.lastUpdated.toLocaleTimeString() : 'Pending...'}</span>
                  </div>
              </div>
            </div>

            {/* Reference List - Improved UI */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8 flex flex-col min-h-[300px]">
                <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
                    <ExternalLink size={22} className="text-blue-500" /> Referenced Sources
                </h3>
                
                <div className="flex-1 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar space-y-3">
                    {feedState.groundingSources.length > 0 ? (
                        feedState.groundingSources.map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-start p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-200"
                            >
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-slate-500 text-xs font-bold font-mono mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base text-slate-300 group-hover:text-white font-medium leading-relaxed break-words transition-colors">
                                      {source.title}
                                  </h4>
                                  <div className="text-xs text-slate-500 mt-1 truncate group-hover:text-blue-400/80 transition-colors">
                                    {source.uri}
                                  </div>
                                </div>
                                <ExternalLink size={16} className="ml-4 text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1" />
                            </a>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                            <RefreshCw size={32} className="mb-3 opacity-20" />
                            <p className="text-center font-medium">No sources active.</p>
                            <p className="text-sm opacity-60 mt-1 text-center">Click 'Refresh Feed' to analyze the web.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Latest Feed Section */}
      <div className="pt-4">
        <h3 className="text-2xl font-bold text-white mb-6 pl-1 border-l-4 border-blue-500">Latest Updates</h3>
        
        {feedState.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-xl mb-6">
                <strong>Error:</strong> {feedState.error}
            </div>
        )}
        
        {feedState.isLoading && feedState.items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3].map(i => (
                    <div key={i} className="h-80 bg-slate-800 rounded-2xl border border-slate-700"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {feedState.items.map(item => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};