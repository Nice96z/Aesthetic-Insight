
import React from 'react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onAction: (liked: boolean) => void;
  disabled?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onAction, disabled }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 transition-transform duration-300">
      <img 
        src={profile.imageUrl} 
        alt={profile.name} 
        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h2>
        <p className="text-slate-300 text-sm leading-relaxed italic">"{profile.bio}"</p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-blue-300 border border-blue-500/20">{profile.ethnicity}</span>
          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-purple-300 border border-purple-500/20">{profile.style}</span>
          <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-pink-300 border border-pink-500/20">{profile.ageGroup}</span>
        </div>

        <div className="flex justify-between gap-4 pt-6">
          <button 
            disabled={disabled}
            onClick={() => onAction(false)}
            className="flex-1 py-4 bg-slate-700/80 hover:bg-red-900/40 text-red-400 font-bold rounded-2xl transition-all border border-slate-600 hover:border-red-500/50"
          >
            DISLIKE
          </button>
          <button 
            disabled={disabled}
            onClick={() => onAction(true)}
            className="flex-1 py-4 bg-slate-100 hover:bg-emerald-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg"
          >
            LIKE
          </button>
        </div>
      </div>
    </div>
  );
};
