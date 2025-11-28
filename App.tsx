import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { NewsCard } from './components/NewsCard';
import { FeedState } from './types';
import { fetchSEONews } from './services/geminiService';
import { DEFAULT_SOURCES } from './constants';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedState, setFeedState] = useState<FeedState>({
    items: [],
    groundingSources: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
  });

  const loadNews = useCallback(async () => {
    setFeedState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchSEONews(DEFAULT_SOURCES);
      setFeedState({
        items: data.items,
        groundingSources: data.grounding,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setFeedState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to fetch updates. Please verify your API Key and try again." 
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <h1 className="text-lg font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">SEO Pulse</h1>
        <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle Menu"
        >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      {/* Mobile: Fixed overlay slider. Desktop: Fixed column. */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
      `}>
          <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }} />
      </div>

      {/* Mobile Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-4 sm:p-6 lg:p-10 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
            {activeTab === 'dashboard' && (
                <Dashboard feedState={feedState} onRefresh={loadNews} />
            )}
            
            {activeTab === 'feed' && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h2 className="text-3xl font-bold text-white">Full News Feed</h2>
                        <span className="text-slate-500 text-sm hidden sm:inline-block">Updated: {feedState.lastUpdated?.toLocaleTimeString()}</span>
                    </div>
                    {feedState.isLoading && feedState.items.length === 0 && (
                        <div className="text-center py-20">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-400">Curating the latest SEO news...</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {feedState.items.map(item => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                 </div>
            )}

            {activeTab === 'sources' && (
                <div className="p-8 bg-slate-900/50 rounded-2xl border border-slate-800 animate-in fade-in duration-500">
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">Source Management</h2>
                    <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
                        We actively monitor these high-authority domains along with broader web searches to bring you the most relevant updates.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {DEFAULT_SOURCES.map((source, idx) => (
                            <div key={idx} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 flex justify-between items-center hover:border-blue-500/30 transition-colors">
                                <span className="text-slate-300 font-medium">{source}</span>
                                <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">ACTIVE</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {activeTab === 'trends' && (
                <div className="p-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-center animate-in fade-in duration-500">
                    <h2 className="text-2xl font-bold text-white mb-4">Trend Analysis</h2>
                    <p className="text-slate-400 mb-8">Deep insights into keyword volatility and search behavior changes coming soon.</p>
                     <div className="flex justify-center items-center h-64 bg-slate-800/30 rounded-xl border-2 border-slate-700/50 border-dashed">
                        <span className="text-slate-500 font-medium">Advanced Analytics Module Placeholder</span>
                     </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;