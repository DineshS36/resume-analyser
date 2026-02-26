'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, Lightbulb } from 'lucide-react';

const thinkingMessages = [
  "Analyzing your experience...",
  "Identifying key achievements...",
  "Crafting action verbs...",
  "Adding quantifiable metrics...",
  "Optimizing for ATS...",
  "Polishing professional tone...",
];

export default function AIThinkingAnimation({ message, progress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-lg"
    >
      {/* Animated Icon */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-500"
          />
          
          {/* Inner pulsing brain */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          {/* Floating sparkles */}
          <motion.div
            animate={{ 
              y: [-5, -15, -5],
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-1 -left-3"
          >
            <Zap className="h-4 w-4 text-orange-500" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [-3, -12, -3],
              opacity: [0.4, 1, 0.4],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            className="absolute top-1 -left-2"
          >
            <Lightbulb className="h-4 w-4 text-blue-500" />
          </motion.div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center mb-4">
        <motion.h4
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-semibold text-gray-800 mb-2"
        >
          {message || "AI is thinking..."}
        </motion.h4>
        
        {/* Rotating sub-messages */}
        <div className="h-6 overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, -48, -72, -96, -120, 0] }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1]
            }}
            className="text-sm text-purple-600"
          >
            {thinkingMessages.map((msg, index) => (
              <div key={index} className="h-6 flex items-center justify-center">
                {msg}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full"
          />
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          animate={{ x: [-100, 300] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-0 left-0 w-20 h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"
        />
      </div>

      {/* Progress percentage */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Processing</span>
        <motion.span
          key={progress}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress}%
        </motion.span>
      </div>

      {/* Fun facts while waiting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-4 p-3 bg-white/50 rounded-lg border border-purple-100"
      >
        <p className="text-xs text-gray-600 text-center">
          <span className="font-medium text-purple-700">Did you know?</span> Resumes with quantified achievements get 3x more interviews!
        </p>
      </motion.div>
    </motion.div>
  );
}
