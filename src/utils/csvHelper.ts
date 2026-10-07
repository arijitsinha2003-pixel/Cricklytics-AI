import { MatchRecord } from '../types/cricket';

export function exportMatchesToCSV(matches: MatchRecord[]): void {
  const headers = [
    'Date',
    'Opponent',
    'Venue',
    'Format',
    'Result',
    'Batting Position',
    'Runs',
    'Balls',
    'Fours',
    'Sixes',
    'Dismissal',
    'Strike Rate',
    'Dot Balls',
    'Overs Bowled',
    'Maidens',
    'Runs Conceded',
    'Wickets',
    'Economy',
    'Performance Rating',
    'Notes'
  ];

  const rows = matches.map(m => [
    m.date,
    `"${m.opponent.replace(/"/g, '""')}"`,
    `"${m.venue.replace(/"/g, '""')}"`,
    m.format,
    m.result,
    m.battingPosition,
    m.runs,
    m.balls,
    m.fours,
    m.sixes,
    m.dismissal,
    m.strikeRate,
    m.dotBalls,
    m.oversBowled,
    m.maidens,
    m.runsConceded,
    m.wickets,
    m.economy,
    m.performanceRating,
    `"${(m.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `cricklytics_matches_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateSampleCSVTemplate(): string {
  return `Date,Opponent,Venue,Format,Result,Batting Position,Runs,Balls,Fours,Sixes,Dismissal,Overs Bowled,Runs Conceded,Wickets,Notes
2026-10-05,Kolkata Knights,Eden Gardens,T20,Won,3,65,42,7,2,Not Out,2,14,1,Solid chase victory
2026-09-29,Mumbai Titans,Wankhede Stadium,T20,Lost,3,48,31,5,2,Caught,3,24,0,Good powerplay start`;
}

export interface CSVParseResult {
  validMatches: Partial<MatchRecord>[];
  errors: string[];
}

export function parseMatchesCSV(text: string): CSVParseResult {
  const lines = text.trim().split(/\r?\n/);
  const errors: string[] = [];
  const validMatches: Partial<MatchRecord>[] = [];

  if (lines.length < 2) {
    return { validMatches: [], errors: ['CSV file appears empty or has no data rows.'] };
  }

  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  const findIdx = (names: string[]) => headers.findIndex(h => names.some(n => h.includes(n)));

  const dateIdx = findIdx(['date']);
  const oppIdx = findIdx(['opponent', 'team']);
  const runsIdx = findIdx(['runs', 'run']);
  const ballsIdx = findIdx(['balls', 'ball']);
  const foursIdx = findIdx(['fours', '4s']);
  const sixesIdx = findIdx(['sixes', '6s']);
  const dismissalIdx = findIdx(['dismissal', 'out']);
  const oversIdx = findIdx(['overs', 'overs bowled']);
  const runsConcededIdx = findIdx(['runs conceded', 'bowling runs']);
  const wicketsIdx = findIdx(['wickets', 'wkts']);
  const venueIdx = findIdx(['venue', 'ground', 'location']);
  const formatIdx = findIdx(['format']);
  const resultIdx = findIdx(['result']);

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Simple CSV splitter handling quoted commas
    const row: string[] = [];
    let insideQuote = false;
    let entry = '';
    for (let char of rawLine) {
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim().replace(/^"|"$/g, ''));

    const opponent = oppIdx >= 0 && row[oppIdx] ? row[oppIdx] : `Opponent #${i}`;
    const runs = runsIdx >= 0 ? parseInt(row[runsIdx] || '0', 10) : 0;
    const balls = ballsIdx >= 0 ? Math.max(1, parseInt(row[ballsIdx] || '1', 10)) : 1;
    const fours = foursIdx >= 0 ? parseInt(row[foursIdx] || '0', 10) : 0;
    const sixes = sixesIdx >= 0 ? parseInt(row[sixesIdx] || '0', 10) : 0;
    const date = dateIdx >= 0 && row[dateIdx] ? row[dateIdx] : new Date().toISOString().slice(0, 10);
    const dismissalRaw = dismissalIdx >= 0 && row[dismissalIdx] ? row[dismissalIdx] : 'Caught';
    const overs = oversIdx >= 0 ? parseFloat(row[oversIdx] || '0') : 0;
    const runsConceded = runsConcededIdx >= 0 ? parseInt(row[runsConcededIdx] || '0', 10) : 0;
    const wickets = wicketsIdx >= 0 ? parseInt(row[wicketsIdx] || '0', 10) : 0;
    const venue = venueIdx >= 0 && row[venueIdx] ? row[venueIdx] : 'Home Ground';
    const format = (formatIdx >= 0 && (row[formatIdx] === 'ODI' || row[formatIdx] === 'Test') ? row[formatIdx] : 'T20') as any;
    const result = (resultIdx >= 0 && (row[resultIdx] === 'Lost' || row[resultIdx] === 'Tied') ? row[resultIdx] : 'Won') as any;

    if (isNaN(runs) || isNaN(balls)) {
      errors.push(`Row ${i + 1}: Invalid runs or balls numbers.`);
      continue;
    }

    const strikeRate = parseFloat(((runs / balls) * 100).toFixed(1));
    const economy = overs > 0 ? parseFloat((runsConceded / overs).toFixed(2)) : 0;
    const rating = Math.min(10, Math.max(2, parseFloat(((runs / 10) + (wickets * 1.5) + (strikeRate > 140 ? 1.5 : 0)).toFixed(1))));

    validMatches.push({
      id: `csv-${Date.now()}-${i}`,
      date,
      opponent,
      venue,
      format,
      result,
      battingPosition: 3,
      runs,
      balls,
      fours,
      sixes,
      dismissal: (dismissalRaw.includes('Not') ? 'Not Out' : dismissalRaw.includes('Bowled') ? 'Bowled' : dismissalRaw.includes('LBW') ? 'LBW' : dismissalRaw.includes('Run') ? 'Run Out' : 'Caught') as any,
      strikeRate,
      dotBalls: Math.round(balls * 0.25),
      oversBowled: overs,
      maidens: 0,
      runsConceded,
      wickets,
      economy,
      bowlingDotBalls: Math.round(overs * 2.5),
      performanceRating: rating,
      mvpPoints: Math.round(runs + (wickets * 25) + (fours * 2.5) + (sixes * 4)),
      wagonWheel: {
        covers: Math.round(runs * 0.28),
        midwicket: Math.round(runs * 0.32),
        straight: Math.round(runs * 0.18),
        fineLeg: Math.round(runs * 0.10),
        thirdMan: Math.round(runs * 0.08),
        cutBehind: Math.round(runs * 0.04)
      },
      phase: {
        powerplay: { runs: Math.round(runs * 0.35), balls: Math.round(balls * 0.3), fours: Math.round(fours * 0.4), sixes: Math.round(sixes * 0.2), wickets: 0, overs: 0, runsConceded: 0 },
        middle: { runs: Math.round(runs * 0.45), balls: Math.round(balls * 0.5), fours: Math.round(fours * 0.4), sixes: Math.round(sixes * 0.5), wickets: wickets, overs: overs, runsConceded: runsConceded },
        death: { runs: Math.round(runs * 0.20), balls: Math.round(balls * 0.2), fours: Math.round(fours * 0.2), sixes: Math.round(sixes * 0.3), wickets: 0, overs: 0, runsConceded: 0 }
      }
    });
  }

  return { validMatches, errors };
}
