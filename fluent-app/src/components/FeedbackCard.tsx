'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, HelpCircle, Trophy, MessageSquareQuote, Quote } from 'lucide-react';

interface FeedbackData {
  correction: string;
  explanation: string;
  amharicBridge: string;
  fluencyScore: number;
  nextQuestion: string;
}

export default function FeedbackCard({ feedback }: { feedback: FeedbackData | null }) {
  if (!feedback) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-indigo-100/50 dark:border-zinc-800/50 rounded-[3rem] shadow-2xl p-10 space-y-8 relative overflow-hidden"
      >
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-4">
             <div className="h-14 w-14 bg-gray-200 dark:bg-zinc-700 rounded-2xl animate-pulse" />
             <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="h-8 w-12 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
             </div>
          </div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-[2rem] border border-indigo-50 dark:border-zinc-800 shadow-sm space-y-3">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
             </div>
             <div className="h-6 w-full bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
             <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
          </div>

          <div className="px-2 space-y-4">
             <div className="flex gap-4">
                <div className="h-6 w-6 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse mt-1" />
                <div className="space-y-2 flex-1">
                   <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                   <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                   <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                </div>
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800/50 space-y-4">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
           </div>
           <div className="h-6 w-full bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
           <div className="h-6 w-4/5 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-lg bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-indigo-100/50 dark:border-zinc-800/50 rounded-[3rem] shadow-2xl p-10 space-y-8 relative overflow-hidden"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
           <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
             <Trophy className="h-7 w-7 text-white" />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Fluency Score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900 dark:text-white tabular-nums">{feedback.fluencyScore}</span>
                <span className="text-lg font-bold text-gray-400">/10</span>
              </div>
           </div>
        </div>
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/10 rounded-xl">
           <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Professor Review</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-[2rem] border border-indigo-50 dark:border-zinc-800 shadow-sm relative group transition-all hover:shadow-md">
           <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                 <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-widest">Better Expression</h4>
           </div>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed italic pr-8">
             "{feedback.correction}"
           </p>
           <Quote className="absolute bottom-6 right-6 h-8 w-8 text-indigo-500/10" />
        </div>

        <div className="px-2 space-y-4">
           <div className="flex gap-4">
              <div className="mt-1 h-6 w-6 shrink-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center justify-center">
                 <HelpCircle className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">The Lesson</h4>
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{feedback.explanation}</p>
              </div>
           </div>

           {feedback.amharicBridge && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20"
             >
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Amharic Bridge</span>
                </div>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{feedback.amharicBridge}</p>
             </motion.div>
           )}
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-zinc-800/50">
         <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 bg-indigo-600 rounded-full animate-ping" />
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Next Interview Question</p>
         </div>
         <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
           "{feedback.nextQuestion}"
         </p>
      </div>
    </motion.div>
  );
}
