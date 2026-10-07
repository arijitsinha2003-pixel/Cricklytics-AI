import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Dumbbell, CheckCircle2, Circle, Plus, Sparkles, Trophy, Flame, Target, ShieldCheck, Zap } from 'lucide-react';
import { TrainingDay, TrainingDrill } from '../../types/cricket';
import { INITIAL_TRAINING_DAYS } from '../../data/mockCricketData';
import { useToast } from '../ui/Toast';

interface TrainingViewProps {
  onAskCoach: (topic: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ onAskCoach }) => {
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>(INITIAL_TRAINING_DAYS);
  const [activeDayId, setActiveDayId] = useState('td-1');
  const [showAddDrill, setShowAddDrill] = useState(false);
  const [newDrillName, setNewDrillName] = useState('');
  const [newDrillReps, setNewDrillReps] = useState('30 mins');
  const [newDrillCat, setNewDrillCat] = useState<'batting' | 'bowling' | 'fitness' | 'mental' | 'fielding'>('batting');
  const { showToast } = useToast();

  const activeDay = useMemo(() => {
    return trainingDays.find((d) => d.id === activeDayId) || trainingDays[0];
  }, [trainingDays, activeDayId]);

  // Overall stats
  const totalDrills = useMemo(() => {
    return trainingDays.reduce((acc, d) => acc + d.drills.length, 0);
  }, [trainingDays]);

  const completedDrills = useMemo(() => {
    return trainingDays.reduce((acc, d) => acc + d.drills.filter((drill) => drill.completed).length, 0);
  }, [trainingDays]);

  const completionPct = Math.round((completedDrills / (totalDrills || 1)) * 100);

  const toggleDrill = (dayId: string, drillId: string) => {
    setTrainingDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        const updatedDrills = day.drills.map((drill) => {
          if (drill.id !== drillId) return drill;
          const nextState = !drill.completed;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#10b981', '#06b6d4', '#f59e0b']
            });
            showToast('Drill Completed! 🏏', `Great work on "${drill.name}".`, 'success');
          }
          return { ...drill, completed: nextState };
        });
        return { ...day, drills: updatedDrills };
      })
    );
  };

  const handleAddDrill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrillName.trim()) return;

    const newDrill: TrainingDrill = {
      id: `drill-${Date.now()}`,
      name: newDrillName,
      repsOrDuration: newDrillReps,
      category: newDrillCat,
      intensity: 'High',
      completed: false
    };

    setTrainingDays((prev) =>
      prev.map((day) => {
        if (day.id !== activeDayId) return day;
        return { ...day, drills: [...day.drills, newDrill] };
      })
    );

    setNewDrillName('');
    setShowAddDrill(false);
    showToast('Drill Added', `Added drill to ${activeDay.day}'s schedule.`, 'success');
  };

  const categoryIcons = {
    batting: '🏏',
    bowling: '🎯',
    fitness: '🏃',
    mental: '🧠',
    fielding: '⚡',
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Personalized Training Center</h1>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Weakness-Targeted
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            AI-prescribed drills targeting spin footwork, LBW vulnerability, and death over acceleration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Progress</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{completionPct}% Done</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            {completedDrills} of {totalDrills} Drills Completed This Week
          </span>
          <span className="font-mono text-emerald-400 font-bold">{completionPct}%</span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {trainingDays.map((day) => {
          const isSelected = activeDayId === day.id;
          const dayCompleted = day.drills.filter((d) => d.completed).length;
          const isAllDone = day.drills.length > 0 && dayCompleted === day.drills.length;

          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-white">{day.day}</span>
                {isAllDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {dayCompleted}/{day.drills.length}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{day.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{activeDay.day} Blueprint</span>
            <h2 className="text-xl font-black text-white mt-0.5">{activeDay.title}</h2>
            <p className="text-xs text-slate-400 mt-1">Focus Area: <span className="text-slate-200">{activeDay.focusArea}</span></p>
          </div>

          <button
            onClick={() => setShowAddDrill(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Drill</span>
          </button>
        </div>

        {/* Add Drill Form Modal/Inline */}
        {showAddDrill && (
          <form onSubmit={handleAddDrill} className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">New Training Drill</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Drill Title / Instructions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Spin machine balls with high front elbow"
                  value={newDrillName}
                  onChange={(e) => setNewDrillName(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newDrillCat}
                  onChange={(e) => setNewDrillCat(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                >
                  <option value="batting">🏏 Batting</option>
                  <option value="bowling">🎯 Bowling</option>
                  <option value="fitness">🏃 Fitness</option>
                  <option value="mental">🧠 Mental Game</option>
                  <option value="fielding">⚡ Fielding</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddDrill(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Add Drill
              </button>
            </div>
          </form>
        )}

        {/* Drills List */}
        <div className="space-y-3">
          {activeDay.drills.map((drill) => (
            <div
              key={drill.id}
              onClick={() => toggleDrill(activeDay.id, drill.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start sm:items-center justify-between gap-4 group ${
                drill.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 text-white'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <button
                  type="button"
                  className={`mt-0.5 sm:mt-0 h-5 w-5 rounded-lg flex items-center justify-center transition-colors ${
                    drill.completed ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 text-transparent group-hover:border-emerald-500'
                  }`}
                >
                  {drill.completed ? <CheckCircle2 className="h-4 w-4 stroke-[3]" /> : <Circle className="h-3 w-3" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{categoryIcons[drill.category] || '🏏'}</span>
                    <h4 className={`text-xs sm:text-sm font-bold ${drill.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {drill.name}
                    </h4>
                  </div>
                  {drill.notes && <p className="text-[11px] text-slate-400 mt-0.5">{drill.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                  {drill.repsOrDuration}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  drill.intensity === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {drill.intensity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Coach Drill Integration Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Need video breakdown or modifications for today's {activeDay.day} drills?</span>
          </div>
          <button
            onClick={() => onAskCoach(`Coach, how do I best perform today's ${activeDay.day} drills for ${activeDay.focusArea}?`)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            Consult AI Coach
          </button>
        </div>
      </div>
    </div>
  );
};
