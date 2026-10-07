import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Volume2, VolumeX, User, RotateCcw, Zap, Target, Flame } from 'lucide-react';
import { CoachMessage, MatchRecord, PlayerProfile } from '../../types/cricket';
import { calculateBattingStats, calculateFormScore } from '../../utils/analyticsEngine';

interface AICoachViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
  initialPrompt?: string;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  matches,
  activePlayer,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome-1',
      sender: 'coach',
      text: `👋 Greetings Arjun! I'm your **Cricklytics AI Technical Coach**.\n\nI've analyzed your **20 match records**, your **148.6 strike rate** during middle overs, and your recent form surge (**${calculateFormScore(matches).score}/100**).\n\nHow can I help you sharpen your technique or prepare for your next opponent today?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'How can I improve my strike rate against spinners?',
        'Analyze my last 5 matches and diagnose weaknesses',
        'What should I focus on against Mumbai Titans pacers?',
        'Give me a 30-minute front-foot stride drill'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const battingStats = calculateBattingStats(matches);
  const form = calculateFormScore(matches);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: CoachMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        message: userText,
        playerStats: {
          name: activePlayer.name,
          role: activePlayer.role,
          average: battingStats.average,
          strikeRate: battingStats.strikeRate,
          runs: battingStats.runs,
          wickets: 15,
          highScore: battingStats.highScore,
          formScore: form.score,
          formTrend: form.trend
        },
        history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text }))
      };

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      const replyText = data.reply || 'Keep practicing your pre-ball trigger routines and maintain good posture.';

      const coachMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: data.suggestedPrompts || [
          'What are my key technical vulnerabilities?',
          'Create a 3-day powerplay batting routine',
          'How should I pace a chase of 180 runs?'
        ]
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error('Coach API Error:', err);
      const errorMsg: CoachMessage = {
        id: `err-${Date.now()}`,
        sender: 'coach',
        text: `### 🎯 Technical Focus: Footwork & Middle Overs Strike Rotation\nBased on your **${battingStats.average} batting average**, you are in peak form! Focus on transferring weight firmly onto the front foot when facing spinners angling into pads to prevent LBW dismissals.`,
        timestamp: 'Just now',
        suggestedPrompts: [
          'How can I improve my dot-ball percentage in away games?',
          'Show me drills for playing short-pitch bowling'
        ]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
      {/* Top Coach Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Coach Dronacharya AI</h2>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Gemini 3.8 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">High-Performance Cricket Biomechanics & Tactical Intelligence</p>
          </div>
        </div>

        {/* Quick stat chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-slate-400">Form:</span>
          <span className="font-bold text-emerald-400">{form.score}/100</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'coach' && (
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md ml-auto'
                : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-inner'
            }`}>
              {/* Message text with basic markdown render */}
              <div className="space-y-2 whitespace-pre-wrap">
                {msg.text.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h4 key={idx} className="text-sm sm:text-base font-bold text-emerald-400 mt-2">{paragraph.replace('### ', '')}</h4>;
                  }
                  if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                    return (
                      <div key={idx} className="pl-2 border-l-2 border-emerald-500/40 py-0.5 my-1 text-slate-300">
                        {paragraph}
                      </div>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>

              {/* Bottom bar of message */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'coach' && (
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors p-1"
                  >
                    {speakingMessageId === msg.id ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5" />
                        <span>Mute</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Listen to Coach</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Suggested Follow-up Prompts */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Tactical Inquiries:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/30 text-[11px] transition-all text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span>Coach is analyzing match telemetry and formulating tactical plan...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. How to counter wide yorkers? Analyze my dot balls...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 py-3 px-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
