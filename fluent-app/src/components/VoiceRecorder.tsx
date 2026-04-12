'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  isLoading: boolean;
}

export default function VoiceRecorder({ onTranscriptionComplete, isLoading }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob);

        try {
          const res = await fetch('/api/whisper', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
             onTranscriptionComplete(data.text);
          } else if (data.error) {
            throw new Error(data.error);
          }
        } catch (error: any) {
          console.error('Transcription failed:', error);
          setPermissionError('Failed to transcribe audio. Please try again.');
        } finally {
          setIsTranscribing(false);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error: any) {
      console.error('Media devices error:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionError('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No microphone found. Please connect a microphone and try again.');
      } else {
        setPermissionError('Failed to access microphone. Please check your browser settings.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!showLoading) {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    }
  };

  const showLoading = isLoading || isTranscribing;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isRecording ? stopRecording : startRecording}
        onKeyDown={handleKeyDown}
        disabled={showLoading}
        tabIndex={0}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-describedby="recording-status"
        className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' 
            : 'bg-indigo-600 text-white shadow-indigo-500/50 hover:bg-indigo-700'
        } ${showLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <AnimatePresence mode="wait">
          {showLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-10 w-10 animate-spin" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="stop"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff className="h-10 w-10" />
            </motion.div>
          ) : (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Mic className="h-10 w-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <motion.div
            layoutId="ring"
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
      <p id="recording-status" className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {showLoading ? 'Processing Voice...' : isRecording ? 'Listening...' : 'Tap to Speak'}
      </p>
      
      {permissionError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center"
        >
          {permissionError}
        </motion.div>
      )}
    </div>
  );
}
