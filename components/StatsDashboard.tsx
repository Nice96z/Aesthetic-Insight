
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AttributeWeights, Hotspot, InsightReport } from '../types';

interface StatsDashboardProps {
  weights: AttributeWeights;
  hotspots: Hotspot[];
  report: InsightReport | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ weights, hotspots, report }) => {
  const getChartData = () => {
    const data: any[] = [];
    Object.entries(weights).forEach(([category, values]) => {
      Object.entries(values).forEach(([label, weight]) => {
        if (weight !== 1.0) { // Only show meaningful deviations
           data.push({ category, label, weight: parseFloat(weight.toFixed(2)) });
        }
      });
    });
    return data.sort((a, b) => b.weight - a.weight).slice(0, 10);
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full" />
          Neural Weight Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="weight">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.weight > 1 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-4 italic text-center">
          Top 10 attribute deviations from baseline (W=1.0)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold mb-4">Geographic Hotspots</h3>
          <div className="space-y-4">
            {hotspots.length > 0 ? hotspots.map((spot, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-blue-400">{spot.city}, {spot.country}</h4>
                  <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                    {Math.round(spot.matchScore * 100)}% Match
                  </span>
                </div>
                <p className="text-sm text-slate-400">{spot.reason}</p>
              </div>
            )) : (
              <p className="text-slate-500 italic text-center py-10">Accumulate more data to reveal hotspots...</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold mb-4">Aesthetic Insight</h3>
          {report ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                 <p className="text-sm leading-relaxed text-slate-300">{report.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.dominantTraits.map((trait, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ) : (
             <p className="text-slate-500 italic text-center py-10">Statistical analysis pending...</p>
          )}
        </div>
      </div>
    </div>
  );
};
