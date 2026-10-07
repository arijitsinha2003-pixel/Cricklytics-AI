import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Plus, Download, Sparkles } from 'lucide-react';
import { MatchRecord, MatchFormat, MatchResult, DismissalType } from '../../types/cricket';
import { parseMatchesCSV, generateSampleCSVTemplate } from '../../utils/csvHelper';
import { useToast } from '../ui/Toast';

interface AddMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMatch: (match: MatchRecord) => void;
  onBulkAddMatches: (matches: MatchRecord[]) => void;
}

export const AddMatchModal: React.FC<AddMatchModalProps> = ({
  isOpen,
  onClose,
  onAddMatch,
  onBulkAddMatches,
}) => {
  const [tab, setTab] = useState<'manual' | 'csv'>('manual');
  const { showToast } = useToast();

  // Manual form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [opponent, setOpponent] = useState('');
  const [venue, setVenue] = useState('Eden Gardens, Kolkata');
  const [format, setFormat] = useState<MatchFormat>('T20');
  const [result, setResult] = useState<MatchResult>('Won');
  const [battingPosition, setBattingPosition] = useState(3);
  const [runs, setRuns] = useState(45);
  const [balls, setBalls] = useState(30);
  const [fours, setFours] = useState(5);
  const [sixes, setSixes] = useState(2);
  const [dismissal, setDismissal] = useState<DismissalType>('Caught');
  const [oversBowled, setOversBowled] = useState(2);
  const [runsConceded, setRunsConceded] = useState(16);
  const [wickets, setWickets] = useState(1);
  const [notes, setNotes] = useState('');

  // CSV state
  const [csvText, setCsvText] = useState('');
  const [csvPreview, setCsvPreview] = useState<Partial<MatchRecord>[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) {
      showToast('Opponent Required', 'Please provide opponent team name.', 'error');
      return;
    }

    const calculatedSR = balls > 0 ? parseFloat(((runs / balls) * 100).toFixed(1)) : 0;
    const calculatedEcon = oversBowled > 0 ? parseFloat((runsConceded / oversBowled).toFixed(2)) : 0;
    const calculatedRating = Math.min(
      10,
      Math.max(2, parseFloat(((runs / 10) + (wickets * 1.5) + (calculatedSR > 140 ? 1.5 : 0)).toFixed(1)))
    );

    const newMatch: MatchRecord = {
      id: `match-${Date.now()}`,
      date,
      opponent,
      venue,
      format,
      result,
      battingPosition,
      runs: Number(runs),
      balls: Math.max(1, Number(balls)),
      fours: Number(fours),
      sixes: Number(sixes),
      dismissal,
      dismissalBowlerType: dismissal === 'Not Out' ? 'N/A' : 'Pace',
      strikeRate: calculatedSR,
      dotBalls: Math.round(Number(balls) * 0.25),
      oversBowled: Number(oversBowled),
      maidens: 0,
      runsConceded: Number(runsConceded),
      wickets: Number(wickets),
      economy: calculatedEcon,
      bowlingDotBalls: Math.round(Number(oversBowled) * 2.5),
      performanceRating: calculatedRating,
      mvpPoints: Math.round(Number(runs) + (Number(wickets) * 25) + (Number(fours) * 2.5) + (Number(sixes) * 4)),
      notes: notes || 'Competitive match performance recorded via Cricklytics AI.',
      wagonWheel: {
        covers: Math.round(runs * 0.28),
        midwicket: Math.round(runs * 0.32),
        straight: Math.round(runs * 0.18),
        fineLeg: Math.round(runs * 0.10),
        thirdMan: Math.round(runs * 0.08),
        cutBehind: Math.round(runs * 0.04),
      },
      phase: {
        powerplay: { runs: Math.round(runs * 0.35), balls: Math.round(balls * 0.3), fours: Math.round(fours * 0.4), sixes: Math.round(sixes * 0.2), wickets: 0, overs: 0, runsConceded: 0 },
        middle: { runs: Math.round(runs * 0.45), balls: Math.round(balls * 0.5), fours: Math.round(fours * 0.4), sixes: Math.round(sixes * 0.5), wickets: Number(wickets), overs: Number(oversBowled), runsConceded: Number(runsConceded) },
        death: { runs: Math.round(runs * 0.20), balls: Math.round(balls * 0.2), fours: Math.round(fours * 0.2), sixes: Math.round(sixes * 0.3), wickets: 0, overs: 0, runsConceded: 0 },
      },
    };

    onAddMatch(newMatch);
    showToast('Match Logged Successfully', `Added match vs ${opponent} (${runs} runs, Rating ${calculatedRating}/10).`, 'success');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || '';
      setCsvText(text);
      const parsed = parseMatchesCSV(text);
      setCsvPreview(parsed.validMatches);
      setCsvErrors(parsed.errors);
      if (parsed.validMatches.length > 0) {
        showToast('CSV Parsed', `${parsed.validMatches.length} valid match records ready for import.`, 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const template = generateSampleCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cricklytics_sample_matches.csv';
    link.click();
    showToast('Template Downloaded', 'Sample CSV downloaded to your device.', 'info');
  };

  const handleBulkImport = () => {
    if (csvPreview.length === 0) return;
    onBulkAddMatches(csvPreview as MatchRecord[]);
    showToast('Bulk Import Complete', `Imported ${csvPreview.length} matches into your performance dataset.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Record Match Performance</h3>
            <p className="text-xs text-slate-400">Add match statistics manually or upload through CSV.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800 mb-6">
          <button
            onClick={() => setTab('manual')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'manual' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Scorecard Entry
          </button>
          <button
            onClick={() => setTab('csv')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'csv' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            CSV Upload & Import
          </button>
        </div>

        {tab === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            {/* Row 1: Date, Opponent, Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai Titans"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Format, Result, Batting Pos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as MatchFormat)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="T20">T20</option>
                  <option value="ODI">ODI (50 Overs)</option>
                  <option value="Test">Test Match</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Match Result</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as MatchResult)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                  <option value="Tied">Tied</option>
                  <option value="No Result">No Result</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Batting Position</label>
                <input
                  type="number"
                  min="1"
                  max="11"
                  value={battingPosition}
                  onChange={(e) => setBattingPosition(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Batting Section */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider">🏏 Batting Score</span>
                <span className="text-emerald-400 font-mono font-bold">
                  SR: {balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.0'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Runs</label>
                  <input
                    type="number"
                    min="0"
                    value={runs}
                    onChange={(e) => setRuns(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Balls</label>
                  <input
                    type="number"
                    min="1"
                    value={balls}
                    onChange={(e) => setBalls(parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Fours (4s)</label>
                  <input
                    type="number"
                    min="0"
                    value={fours}
                    onChange={(e) => setFours(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Sixes (6s)</label>
                  <input
                    type="number"
                    min="0"
                    value={sixes}
                    onChange={(e) => setSixes(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Dismissal</label>
                  <select
                    value={dismissal}
                    onChange={(e) => setDismissal(e.target.value as DismissalType)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  >
                    <option value="Not Out">Not Out</option>
                    <option value="Caught">Caught</option>
                    <option value="Bowled">Bowled</option>
                    <option value="LBW">LBW</option>
                    <option value="Run Out">Run Out</option>
                    <option value="Stumped">Stumped</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bowling Section */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider">🎯 Bowling Figures (Optional)</span>
                <span className="text-amber-400 font-mono font-bold">
                  Econ: {oversBowled > 0 ? (runsConceded / oversBowled).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Overs Bowled</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={oversBowled}
                    onChange={(e) => setOversBowled(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Runs Conceded</label>
                  <input
                    type="number"
                    min="0"
                    value={runsConceded}
                    onChange={(e) => setRunsConceded(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Wickets</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={wickets}
                    onChange={(e) => setWickets(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Match Notes & Insights</label>
              <textarea
                rows={2}
                placeholder="Tactical takeaways, pitch behavior, bowler match-ups..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Save & Analyze Match</span>
            </button>
          </form>
        ) : (
          /* CSV Upload Tab */
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500 text-center bg-slate-950/40 transition-colors">
              <Upload className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">Upload Cricket CSV File</p>
              <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                CSV should include columns for Date, Opponent, Runs, Balls, Fours, Sixes, Dismissal, and Bowling figures.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow-md">
                  Browse CSV File
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Sample Template</span>
                </button>
              </div>
            </div>

            {/* CSV Errors */}
            {csvErrors.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
                <p className="font-bold flex items-center gap-1.5 mb-1"><AlertCircle className="h-4 w-4" /> CSV Validation Errors:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {csvErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CSV Preview */}
            {csvPreview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Validated Records Preview ({csvPreview.length})
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Ready to Import
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 divide-y divide-slate-800/60 text-xs">
                  {csvPreview.slice(0, 5).map((m, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">vs {m.opponent}</span>
                        <span className="text-slate-400 ml-2">({m.date})</span>
                      </div>
                      <div className="font-mono text-emerald-400 font-bold">
                        {m.runs} ({m.balls}b) • SR {m.strikeRate}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Import {csvPreview.length} Matches into Cricklytics AI</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
