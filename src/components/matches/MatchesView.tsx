import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Calendar, MapPin, Award, ChevronRight, ArrowUpDown } from 'lucide-react';
import { MatchRecord } from '../../types/cricket';
import { exportMatchesToCSV } from '../../utils/csvHelper';
import { useToast } from '../ui/Toast';

interface MatchesViewProps {
  matches: MatchRecord[];
  onSelectMatch: (match: MatchRecord) => void;
  onOpenAddMatch: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onSelectMatch,
  onOpenAddMatch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<'All' | 'Won' | 'Lost'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'runs' | 'strikeRate' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { showToast } = useToast();

  const filteredMatches = useMemo(() => {
    return matches
      .filter((m) => {
        const matchesSearch =
          m.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.venue.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesResult = resultFilter === 'All' || m.result === resultFilter;
        return matchesSearch && matchesResult;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'date') diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        else if (sortBy === 'runs') diff = a.runs - b.runs;
        else if (sortBy === 'strikeRate') diff = a.strikeRate - b.strikeRate;
        else if (sortBy === 'rating') diff = a.performanceRating - b.performanceRating;
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [matches, searchTerm, resultFilter, sortBy, sortOrder]);

  const handleExport = () => {
    exportMatchesToCSV(filteredMatches);
    showToast('CSV Exported', `Exported ${filteredMatches.length} match records.`, 'success');
  };

  const toggleSort = (field: 'date' | 'runs' | 'strikeRate' | 'rating') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Match History & Scorecards</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and analyze all logged competitive fixtures ({matches.length} matches).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddMatch}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Log Match / Import</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by opponent or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Result toggle buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            {(['All', 'Won', 'Lost'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setResultFilter(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  resultFilter === r ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Match Table / Cards */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-1">Date & Opponent <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3.5 px-4">Venue</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('runs')}>
                  <div className="flex items-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('strikeRate')}>
                  <div className="flex items-center gap-1">Strike Rate <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3.5 px-4">Dismissal</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('rating')}>
                  <div className="flex items-center gap-1">Rating <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMatches.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelectMatch(m)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      vs {m.opponent}
                    </p>
                    <p className="text-[11px] text-slate-400">{m.date} • {m.format}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {m.venue.split(',')[0]}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      m.result === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {m.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {m.runs} <span className="text-slate-400 font-normal">({m.balls}b)</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">
                    {m.strikeRate}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className={m.dismissal === 'Not Out' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {m.dismissal}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400">
                    {m.performanceRating}/10
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-400 transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
