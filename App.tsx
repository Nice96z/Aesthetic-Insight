
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Profile, 
  AppState, 
  ProfileAttribute, 
  AttributeWeights 
} from './types';
import { 
  INITIAL_WEIGHTS, 
  WEIGHT_INCREMENT, 
  PROBING_INTERVAL,
  ATTRIBUTE_KEYS
} from './constants';
import { 
  generateProfiles, 
  getRefiningQuestion, 
  getHotspots, 
  getInsightReport 
} from './services/geminiService';
import { ProfileCard } from './components/ProfileCard';
import { StatsDashboard } from './components/StatsDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    profiles: [],
    currentIndex: 0,
    weights: INITIAL_WEIGHTS,
    interactionCount: 0,
    refiningQuestion: null,
    hotspots: [],
    report: null,
    isGenerating: false
  });

  const [activeTab, setActiveTab] = useState<'discover' | 'stats'>('discover');

  const initializeProfiles = useCallback(async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    try {
      const newProfiles = await generateProfiles(15);
      setState(prev => ({
        ...prev,
        profiles: [...prev.profiles, ...newProfiles],
        isGenerating: false
      }));
    } catch (error) {
      console.error("Failed to load profiles:", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, []);

  useEffect(() => {
    initializeProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateWeights = (profile: Profile, liked: boolean) => {
    setState(prev => {
      const newWeights = { ...prev.weights };
      const delta = liked ? WEIGHT_INCREMENT : -WEIGHT_INCREMENT;

      ATTRIBUTE_KEYS.forEach(key => {
        const value = profile[key as keyof ProfileAttribute];
        const currentWeight = newWeights[key][value] || 1.0;
        newWeights[key][value] = Math.max(0.1, currentWeight + delta);
      });

      return {
        ...prev,
        weights: newWeights,
        interactionCount: prev.interactionCount + 1,
        currentIndex: prev.currentIndex + 1
      };
    });
  };

  const handleSwipeAction = async (liked: boolean) => {
    const currentProfile = state.profiles[state.currentIndex];
    if (!currentProfile) return;

    updateWeights(currentProfile, liked);

    // Fetch more profiles if running low
    if (state.profiles.length - state.currentIndex < 5) {
      initializeProfiles();
    }
  };

  // Run probing/analysis logic
  useEffect(() => {
    const triggerAnalysis = async () => {
      if (state.interactionCount > 0 && state.interactionCount % PROBING_INTERVAL === 0) {
        const question = await getRefiningQuestion(state.weights);
        const spots = await getHotspots(state.weights);
        const rep = await getInsightReport(state.weights);
        
        setState(prev => ({
          ...prev,
          refiningQuestion: question,
          hotspots: spots,
          report: rep
        }));
      }
    };
    triggerAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.interactionCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          AESTHETIC INSIGHT
        </h1>
        <p className="text-slate-400 text-sm max-w-lg">
          A preference analytics engine designed to decode your subconscious attraction patterns through high-fidelity demographic modeling.
        </p>
      </header>

      <main className="max-w-4xl mx-auto relative">
        <div className="flex justify-center mb-8 bg-slate-900/40 p-1 rounded-2xl w-fit mx-auto border border-slate-800">
          <button 
            onClick={() => setActiveTab('discover')}
            className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'discover' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            DISCOVER
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-8 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ANALYTICS
          </button>
        </div>

        {activeTab === 'discover' ? (
          <div className="flex flex-col items-center">
            {state.refiningQuestion && (
              <div className="w-full max-w-sm mb-6 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl animate-pulse">
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Analytical Probe</p>
                <p className="text-sm text-indigo-100 italic">"{state.refiningQuestion}"</p>
                <button 
                  onClick={() => setState(prev => ({ ...prev, refiningQuestion: null }))}
                  className="mt-2 text-[10px] text-slate-500 hover:text-white underline uppercase"
                >
                  Dismiss
                </button>
              </div>
            )}

            {state.profiles[state.currentIndex] ? (
              <ProfileCard 
                profile={state.profiles[state.currentIndex]} 
                onAction={handleSwipeAction}
                disabled={state.isGenerating}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-slate-500 flex-col gap-4">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
                <p className="animate-pulse">Loading Aesthetic Data...</p>
              </div>
            )}
            
            <div className="mt-8 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
              Processing: Sequence {state.interactionCount} | Entropy: {state.isGenerating ? 'High' : 'Stable'}
            </div>
          </div>
        ) : (
          <StatsDashboard 
            weights={state.weights} 
            hotspots={state.hotspots} 
            report={state.report} 
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 p-4 text-center">
        <p className="text-[10px] text-slate-600 font-medium tracking-widest">
          &copy; 2024 PREFERENCE ANALYTICS ENGINE // AESTHETIC INSIGHT RESEARCH LABORATORY
        </p>
      </footer>
    </div>
  );
};

export default App;
