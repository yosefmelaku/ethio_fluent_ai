'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Target, CheckCircle, ArrowRight } from 'lucide-react';

interface SummaryData {
  overallScore: number;
  topStrengths: string[];
  areasForImprovement: string[];
  grammarFocus: string;
  finalAdvice: string;
}

export default function SummaryCard({ summary, onRestart }: { summary: SummaryData | null, onRestart: () => void }) {
  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl p-10 space-y-10"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/10 rounded-full text-yellow-600 dark:text-yellow-400 font-black text-[10px] uppercase tracking-widest">
           <Trophy className="h-3 w-3" />
           Session Complete
        </div>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Your Job-Ready Score</h2>
      </div>

      <div className="flex flex-col items-center">
         <div className="relative h-48 w-48 flex items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
               <circle 
                 cx="96" cy="96" r="88" 
                 className="stroke-gray-100 dark:stroke-zinc-800 fill-none" 
                 strokeWidth="12" 
               />
               <motion.circle 
                 cx="96" cy="96" r="88" 
                 className="stroke-indigo-600 dark:stroke-indigo-500 fill-none" 
                 strokeWidth="12" 
                 strokeDasharray="552.92"
                 initial={{ strokeDashoffset: 552.92 }}
                 animate={{ strokeDashoffset: 552.92 - (552.92 * summary.overallScore) / 100 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 strokeLinecap="round"
               />
            </svg>
            <div className="text-6xl font-black text-gray-900 dark:text-white tabular-nums">
               {summary.overallScore}%
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
         <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
               <Star className="h-4 w-4" /> Top Strengths
            </h4>
            <ul className="space-y-2">
               {summary.topStrengths.map((s, i) => (
                 <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 font-medium text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {s}
                 </li>
               ))}
            </ul>
         </div>

         <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
               <Target className="h-4 w-4" /> Improve Next
            </h4>
            <p className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl text-indigo-700 dark:text-indigo-300 font-bold text-sm bg-blue-50">
               Grammar Focus: {summary.grammarFocus}
            </p>
         </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl space-y-2">
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Professor's Final Advice</p>
         <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">"{summary.finalAdvice}"</p>
      </div>

      <button 
        onClick={onRestart}
        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-transform active:scale-[0.98]"
      >
        Start New Interview Practice
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  );
}
