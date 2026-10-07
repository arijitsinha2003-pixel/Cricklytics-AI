import React, { useState } from 'react';
import { Settings, Shield, Bell, Moon, RefreshCw, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { exportMatchesToCSV } from '../../utils/csvHelper';
import { MatchRecord } from '../../types/cricket';
import { INITIAL_MATCHES } from '../../data/mockCricketData';
import { useToast } from '../ui/Toast';

interface SettingsViewProps {
  matches: MatchRecord[];
  onResetMatches: (matches: MatchRecord[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ matches, onResetMatches }) => {
  const [metricUnit, setMetricUnit] = useState<'kmh' | 'mph'>('kmh');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiAutoAnalyze, setAiAutoAnalyze] = useState(true);
  const { showToast } = useToast();

  const handleReset = () => {
    if (window.confirm('Reset all match telemetry back to Arjun Sharma demo state?')) {
      onResetMatches(INITIAL_MATCHES);
      showToast('Data Reset', 'Restored 20 default competitive match records.', 'info');
    }
  };

  const handleExport = () => {
    exportMatchesToCSV(matches);
    showToast('Export Successful', `Exported ${matches.length} matches to CSV.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <h1 className="text-2xl font-black text-white tracking-tight">Platform Preferences & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure telemetry units, AI analysis preferences, and manage athlete database storage.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Analytics & Measurement Units
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Bowling Speed Units</p>
              <p className="text-slate-400">Select velocity display standard.</p>
            </div>
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setMetricUnit('kmh')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  metricUnit === 'kmh' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                km/h (Metric)
              </button>
              <button
                onClick={() => setMetricUnit('mph')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  metricUnit === 'mph' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                mph (Imperial)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Automated AI Post-Match Diagnostics</p>
              <p className="text-slate-400">Auto-generate strength/weakness vectors when new scorecards are saved.</p>
            </div>
            <button
              onClick={() => setAiAutoAnalyze(!aiAutoAnalyze)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                aiAutoAnalyze ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Form Trend Alerts & Milestone Notifications</p>
              <p className="text-slate-400">Receive alerts when batting average surges or drop thresholds trigger.</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${
                notificationsEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Data Management & Archival
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Full CSV Telemetry Export</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Download your complete dataset ({matches.length} matches, wagon wheels, bowling spells, and MVP points).
            </p>
            <button
              onClick={handleExport}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-2">
            <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>Reset to Clean Demo Data</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Reset match records back to the default Arjun Sharma Bengal Strikers dataset.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold transition-colors"
            >
              Reset Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
