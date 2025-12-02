import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-16 md:pt-24 text-center max-w-4xl mx-auto relative">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Master Java with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
            Adaptive Learning
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Take a quick assessment and receive a personalized learning path tailored to your skill level. Progress at your own pace with courses designed just for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2">
            Take Free Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button className="px-8 py-3.5 bg-surfaceHighlight border border-gray-700 hover:border-gray-500 hover:bg-surface rounded-xl text-gray-200 font-semibold transition-all duration-200 w-full sm:w-auto">
            Create Account
          </button>
        </div>

        {/* Decorative Wave/Lines - Abstract SVG representation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[400px] pointer-events-none z-[-1] opacity-30">
            <svg viewBox="0 0 1000 400" className="w-full h-full">
                <path d="M0,200 Q250,150 500,200 T1000,200" fill="none" stroke="url(#grad1)" strokeWidth="2" />
                <path d="M0,220 Q250,170 500,220 T1000,220" fill="none" stroke="url(#grad2)" strokeWidth="2" />
                <path d="M0,180 Q250,130 500,180 T1000,180" fill="none" stroke="url(#grad1)" strokeWidth="2" opacity="0.5" />
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
                        <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </section>
  );
};

export default Hero;