import React from 'react';
import { Keyboard, Bolt, Mouse, BrainCircuit } from 'lucide-react';

export const ImprovedHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-600 to-indigo-700 transform -skew-y-3 -translate-y-24"></div>
        <div className="absolute top-0 right-0 w-2/3 h-48 bg-gradient-to-l from-indigo-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Animated keyboard keys background */}
        <div className="hidden md:block absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-lg w-10 h-10 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Logo area */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Main icon with glow effect */}
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative flex items-center justify-center p-5 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-xl border border-blue-100">
              <Keyboard className="w-12 h-12 text-indigo-600" />
            </div>
            
            {/* Floating icons around main icon */}
            <div className="absolute -top-2 -right-6 p-3 bg-white rounded-full shadow-md border border-indigo-100 animate-bounce" style={{ animationDuration: '3s' }}>
              <Bolt className="w-6 h-6 text-amber-500" />
            </div>
            <div className="absolute -bottom-1 -left-6 p-3 bg-white rounded-full shadow-md border border-indigo-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <Mouse className="w-6 h-6 text-blue-500" />
            </div>
            <div className="absolute -top-4 -left-4 p-3 bg-white rounded-full shadow-md border border-indigo-100 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
              <BrainCircuit className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="text-center space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-2">
                Keymaster Training
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Master your keyboard combinations for faster gameplay and increased productivity
            </p>
            
            {/* Feature badges */}
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
                <Bolt className="w-4 h-4" /> Speed Training
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                <Mouse className="w-4 h-4" /> Mouse + Keyboard
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium flex items-center gap-1">
                <BrainCircuit className="w-4 h-4" /> Muscle Memory
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Curved divider at the bottom */}
      <div className="relative z-10 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};