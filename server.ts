import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), aiReady: !!ai });
});

// AI Coach Chat endpoint
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, playerStats, history } = req.body;

    const systemInstruction = `You are "Coach Dronacharya / Cricklytics AI Head Coach", an elite cricket technical coach and high-performance data analyst with decades of experience at top international & IPL franchises.
Your goal is to provide concise, direct, tactical, and data-backed advice to the player based on their performance data.
Current Player Profile & Stats:
- Name: ${playerStats?.name || 'Arjun Sharma'}
- Role: ${playerStats?.role || 'Top-order Batter'}
- Batting Avg: ${playerStats?.average || '42.7'}
- Strike Rate: ${playerStats?.strikeRate || '148.6'}
- Total Runs: ${playerStats?.runs || '909'}
- Wickets: ${playerStats?.wickets || '15'}
- Best Score: ${playerStats?.highScore || '85'}
- Recent Form Score: ${playerStats?.formScore || '92'} / 100 (${playerStats?.formTrend || 'Excellent'})
- Vulnerability noted: 4 of last 7 dismissals were LBW/Bowled against spin angling into pads.
- Strongest phase: Middle overs (7-15) strike rate 148.6.

Response Guidelines:
1. Tone: Inspiring, professional, sports-tech analytical, realistic cricket terminology (e.g., seam presentation, wrist alignment, trigger movement, front-foot stride, length corridors, powerplay field restrictions).
2. Format: Use clean markdown with clear headings, bullet points, and actionable drills when relevant.
3. Keep responses punchy, direct, and under 3-4 short paragraphs unless an exhaustive drill regimen is asked for.
4. Always provide 2-3 specific follow-up tactical suggestions.`;

    if (!ai) {
      // Fallback smart rule-based engine
      const lower = (message || '').toLowerCase();
      let reply = '';
      let suggestedPrompts = [
        'How do I reduce my dot-ball percentage in away matches?',
        'What drill will fix my front-pad LBW vulnerability?',
        'Give me a 3-step death over acceleration plan'
      ];

      if (lower.includes('strike rate') || lower.includes('faster') || lower.includes('power')) {
        reply = `### 🔥 Strike Rate & Power Acceleration Blueprint
Based on your last 10 innings, your strike rate is strong at **${playerStats?.strikeRate || '148.6'}**, but your dot ball % in the first 8 balls is **28%**.

**Tactical Adjustments:**
1. **Trigger Movement:** Shift your back-foot pre-movement 2 inches deeper in the crease against 135kph+ pace to buy extra fractions of a second on pull shots.
2. **Accessing Down-the-Ground Boundaries:** In overs 7-15, avoid the early aerial slog across the line. Instead, utilize the high-elbow punch over mid-off.
3. **Weight Transfer Drill:** 40 repetitions of weighted bat swing targeting lengths between 4 to 6 meters.`;
      } else if (lower.includes('weakness') || lower.includes('spin') || lower.includes('lbw')) {
        reply = `### 🎯 Spin Diagnostic & Front-Foot Correction
Data shows **57% of your dismissals against spin** are LBW or Bowled when attempting to work incoming arm balls off the back foot.

**Key Technical Fixes:**
1. **Front Knee Alignment:** Ensure your front knee flexes toward the line of the off-stump rather than locking in front of middle-and-leg.
2. **Soft Hands Defense:** When doubtful about turn, play with soft bottom hand directly under the eyes so the ball drops dead at your feet for a quick single.
3. **Advancing Down the Track:** Practice taking a half-step forward as the bowler enters delivery stride to smother the spin before it turns.`;
      } else if (lower.includes('training') || lower.includes('drill') || lower.includes('plan')) {
        reply = `### 🏏 High-Performance Weekly Drill Focus
Here is your customized micro-training block:
- **Session 1 (Footwork & Spin):** 80 deliveries with bowling machine on middle-and-leg line, mandatory front-foot stride and soft hands tap.
- **Session 2 (Death Overs Execution):** 6 overs of wide-line yorker digging and ramp shot simulation.
- **Session 3 (Physical):** Lateral agility shuttle sprints (4x25m) to sharpen rapid crease running.`;
      } else {
        reply = `### 📊 Performance Analysis: Match Form
Your recent form rating is **${playerStats?.formScore || '92'}/100 (${playerStats?.formTrend || 'Excellent'})** with a surging batting average of **${playerStats?.average || '42.7'}**.

**Top Observations:**
- **Middle Overs Dominance:** You are controlling overs 7–15 with a 148.6 strike rate and steady boundary conversion.
- **Immediate Opportunity:** Away ground dot-ball rate is 8.4% higher than home matches. Look to steal quick singles to short fine-leg and third-man early in your innings.

What specific aspect would you like to drill down on?`;
      }

      return res.json({
        reply,
        suggestedPrompts
      });
    }

    // Call Gemini Model
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Keep your eyes on the ball and focus on balanced footwork!';
    return res.json({
      reply,
      suggestedPrompts: [
        'How can I improve my strike rate against spinners?',
        'What should be my death overs blueprint?',
        'Analyze my boundary conversion rate'
      ]
    });
  } catch (error: any) {
    console.error('Gemini Coach error:', error);
    res.status(500).json({
      error: 'AI Coach service temporarily offline',
      reply: 'AI Coach is recalibrating data models. In the meantime, focus on your pre-shot routine and solid front-foot balance against spin!'
    });
  }
});

// AI Performance Deep-Analysis endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { matches, player } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'local-engine'
      });
    }

    const prompt = `Analyze these cricket match records for player ${player?.name || 'Arjun Sharma'}:
Total Matches: ${matches?.length}
Recent 5 matches runs: ${matches?.slice(0, 5).map((m: any) => `${m.opponent}: ${m.runs}(${m.balls})`).join(', ')}

Return a structured JSON with:
1. "summary": 2 sentence summary of form.
2. "strengths": array of 2 strings
3. "weaknesses": array of 2 strings
4. "observations": array of 2 strings
5. "recommendations": array of 2 strings`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      analysis: parsed
    });
  } catch (error) {
    console.error('Analyze error:', error);
    res.json({ success: false, message: 'Fallback to local analytics engine' });
  }
});

// Vite Middleware for development / Static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`🏏 Cricklytics AI server running on http://localhost:${port}`);
  });
}

startServer();
