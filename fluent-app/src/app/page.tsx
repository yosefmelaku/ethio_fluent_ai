'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceRecorder from '@/components/VoiceRecorder';
import FeedbackCard from '@/components/FeedbackCard';
import SummaryCard from '@/components/SummaryCard';
import { ChevronRight, Sparkles, Globe, BrainCircuit, Headphones, Trophy, ArrowRight, LogOut, Flame, Target } from 'lucide-react';
import Image from 'next/image';

interface Status {
  isProcessing: boolean;
  error: string | null;
}

type View = 'hero' | 'practice' | 'summary';

export default function Home() {
  const [view, setView] = useState<View>('hero');
  const [feedback, setFeedback] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [status, setStatus] = useState<Status>({ isProcessing: false, error: null });
  const [history, setHistory] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    try {
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error('TTS Failed:', err);
    }
  };

  const startSession = async () => {
    setView('practice');
    setHistory([]);
    setFeedback(null);
    setSummary(null);
    
    // Initial Professor Greeting
    const greeting = "Hello! I am your BDU English Professor. Let's practice for your interview at Ethio Telecom. Tell me about your senior project.";
    setFeedback({
      nextQuestion: greeting,
      correction: "Greeting from BDU",
      explanation: "Welcome to your practice session! I'll be acting as your HR Manager today.",
      amharicBridge: "እንኳን ደህና መጣህ (Enkuan Dehna Meta)",
      fluencyScore: 10
    });
    speakText(greeting);
  };

  const handleTranscription = async (text: string) => {
    setStatus({ isProcessing: true, error: null });
    try {
      // 1. Send to Brain (GPT-4o)
      const brainRes = await fetch('/api/brain', {
        method: 'POST',
        body: JSON.stringify({ text, history }),
        headers: { 'Content-Type': 'application/json' },
      });
      const brainData = await brainRes.json();
      
      if (brainData.error) throw new Error(brainData.error);
      
      setFeedback(brainData);
      setHistory(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: JSON.stringify(brainData) }]);

      // 2. Synthesize Next Question (TTS)
      await speakText(brainData.nextQuestion);
    } catch (err: any) {
      setStatus({ isProcessing: false, error: err.message });
    } finally {
      setStatus(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const endSession = async () => {
    setStatus({ isProcessing: true, error: null });
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        body: JSON.stringify({ history }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setSummary(data);
      setView('summary');
    } catch (err: any) {
      setStatus({ isProcessing: false, error: err.message });
    } finally {
      setStatus(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] dark:bg-[#09090B] selection:bg-indigo-100 dark:selection:bg-indigo-900/30 overflow-x-hidden font-sans">
      {/* Abstract Background Decoration */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -right-[10%] w-[100%] h-[100%] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px]" 
         />
         <motion.div 
           animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-100/20 dark:bg-emerald-900/10 rounded-full blur-[100px]" 
         />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
               <BrainCircuit className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">Ethio-Fluent <span className="text-indigo-600">AI</span></span>
         </div>
         {view === 'practice' && (
           <motion.button
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             onClick={endSession}
             className="px-5 py-2.5 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-2xl font-bold flex items-center gap-2 transition-colors border border-red-100 dark:border-red-900/20"
           >
             <LogOut className="h-4 w-4" />
             End Session
           </motion.button>
         )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center relative">
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 max-w-4xl pt-12"
            >
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400 font-black tracking-tight text-xs uppercase letter-spacing-widest">
                    <Sparkles className="h-4 w-4 fill-current" />
                    BDU Hackathon Entry 2026
                  </div>
                  
                  <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
                    Master English for the <span className="text-indigo-600 dark:text-indigo-500">Ethiopian Job Market</span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto italic">
                    "A zero-judgment, 24/7 AI Speaking Coach that understands our local context."
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={startSession}
                    className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl flex items-center gap-3 shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                  >
                    Start Your Session
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Flame className="h-4 w-4 text-orange-500" />
                     1k+ Students Practicing Today
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                  <Badge icon={<Globe className="h-4 w-4" />} label="Context Aware" />
                  <Badge icon={<Target className="h-4 w-4" />} label="Interview Prep" />
                  <Badge icon={<BrainCircuit className="h-4 w-4" />} label="Grammar Score" />
                  <Badge icon={<Headphones className="h-4 w-4" />} label="Natural TTS" />
               </div>
            </motion.div>
          )}

          {view === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-12 w-full pt-4 items-start"
            >
               <div className="flex flex-col items-center space-y-12">
                  <div className="w-full bg-white dark:bg-zinc-900 border border-indigo-50 dark:border-zinc-800 rounded-[3rem] p-12 shadow-2xl shadow-indigo-100/30 dark:shadow-none space-y-10">
                     <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Active Interview Session</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Practice speaking clearly. The professor is listening.</p>
                     </div>

                     <VoiceRecorder onTranscriptionComplete={handleTranscription} isLoading={status.isProcessing} />

                     <div className="flex flex-col gap-4 border-t border-gray-50 dark:border-zinc-800/50 pt-8">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Session Progress</p>
                        <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min(history.length * 10, 100)}%` }}
                             className="h-full bg-indigo-600"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 w-full">
                     <StepCard number="EARS" title="Whisper AI" description="Understanding your unique Ethiopian accent." />
                     <StepCard number="MOUTH" title="OpenAI TTS" description="Hear perfect English pronunciation." />
                  </div>
               </div>

               <div className="space-y-8 flex flex-col items-center">
                  <AnimatePresence mode="wait">
                     {feedback ? (
                       <FeedbackCard key="feedback" feedback={feedback} />
                     ) : status.isProcessing ? (
                       <FeedbackCard key="loading" feedback={null} />
                     ) : (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="w-full h-[450px] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-12 space-y-4"
                       >
                         <div className="h-24 w-24 bg-gray-50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center">
                            <Trophy className="h-12 w-12 text-gray-300 dark:text-zinc-700" />
                         </div>
                         <h3 className="text-2xl font-black text-gray-300 dark:text-zinc-600 uppercase tracking-widest">Professor's<br/>Feedback</h3>
                         <p className="text-gray-400 dark:text-zinc-500 font-medium italic">"Waiting for your response..."</p>
                       </motion.div>
                     )}
                  </AnimatePresence>

                  {status.error && (
                    <motion.div 
                      layout
                      className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-5 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3 shadow-lg shadow-red-100/20"
                    >
                       <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                       {status.error}
                    </motion.div>
                  )}
               </div>
            </motion.div>
          )}

          {view === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-4"
            >
               <SummaryCard summary={summary} onRestart={() => setView('hero')} />
            </motion.div>
          )}
        </AnimatePresence>

        <audio ref={audioRef} hidden />
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-gray-100 dark:border-zinc-900 py-16 px-6 flex flex-col items-center gap-8">
         <div className="flex items-center gap-6">
            <div className="h-32 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-zinc-800 to-transparent" />
         </div>
         <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-gray-400 dark:text-zinc-600 font-black uppercase tracking-widest text-[10px]">
               <span>Developed at Bahir Dar University</span>
               <span className="h-1 w-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
               <span>Ethio-Fluent AI © 2026</span>
            </div>
            <div className="text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.2em]">Empowering Ethiopian Graduates</div>
         </div>
      </footer>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-zinc-800/30 backdrop-blur-sm border border-gray-100 dark:border-zinc-800 rounded-2xl text-gray-700 dark:text-gray-300 text-xs font-black uppercase tracking-widest shadow-sm">
       <span className="text-indigo-600">{icon}</span>
       {label}
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="p-8 bg-zinc-50 dark:bg-zinc-800/20 border border-white dark:border-zinc-800 rounded-[2rem] space-y-4 hover:border-indigo-100 transition-colors group">
       <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">{number}</span>
       <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{title}</h4>
       <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed opacity-80">
          {description}
       </p>
    </div>
  );
}
