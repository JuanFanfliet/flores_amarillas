import React, { useState, useEffect, useCallback } from 'react';

// Custom CSS for animations that are complex for standard Tailwind utility classes
const globalStyles = `
  @keyframes sway-left {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-5deg); }
  }
  @keyframes sway-right {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(5deg); }
  }
  @keyframes sway-center {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes float-up {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(1.5) rotate(45deg); opacity: 0; }
  }
  @keyframes bloom {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); filter: brightness(1.2); }
    100% { transform: scale(1); }
  }
  .animate-sway-left { animation: sway-left 4s ease-in-out infinite; }
  .animate-sway-right { animation: sway-right 5s ease-in-out infinite; }
  .animate-sway-center { animation: sway-center 4.5s ease-in-out infinite; }
  .animate-float-up { animation: float-up 1s ease-out forwards; }
  .animate-bloom { animation: bloom 0.5s ease-in-out; }
  
  .flower-container {
    transform-origin: bottom center;
  }
`;

// Particle effect when clicking a flower
const Particle = ({ id, x, y, symbol, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 1000); // match the animation duration
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div 
      className="absolute animate-float-up pointer-events-none select-none text-xl"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        textShadow: '0 0 5px rgba(255, 215, 0, 0.8)'
      }}
    >
      {symbol}
    </div>
  );
};

// Individual Flower Component
const Flower = ({ x, y, rotation, scale, animationClass, delay }) => {
  const [particles, setParticles] = useState([]);
  const [isBlooming, setIsBlooming] = useState(false);

  // Handle click interaction
  const handleClick = (e) => {
    if (isBlooming) return;
    
    // Trigger bloom animation
    setIsBlooming(true);
    setTimeout(() => setIsBlooming(false), 500);

    // Generate random particles (sparkles/hearts)
    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      offsetX: (Math.random() - 0.5) * 60,
      offsetY: (Math.random() - 0.5) * 60 - 20,
      symbol: Math.random() > 0.5 ? '✨' : '💛'
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const removeParticle = useCallback((idToRemove) => {
    setParticles(prev => prev.filter(p => p.id !== idToRemove));
  }, []);

  // Generate 16 petals in a circle
  const petals = Array.from({ length: 16 }).map((_, i) => {
    const angle = i * (360 / 16);
    return (
      <ellipse 
        key={`petal-${i}`}
        cx="50" 
        cy="50" 
        rx="8" 
        ry="28" 
        fill="url(#petalGradient)" 
        transform={`rotate(${angle} 50 50) translate(0 -25)`}
        className="drop-shadow-sm"
      />
    );
  });

  return (
    <div 
      className={`absolute flower-container ${animationClass}`}
      style={{ 
        left: `${x}%`, 
        bottom: `${y}%`, 
        transform: `rotate(${rotation}deg) scale(${scale})`,
        animationDelay: `${delay}s`,
        zIndex: Math.round(scale * 10)
      }}
    >
      {/* Container for click area and SVG */}
      <div 
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${isBlooming ? 'animate-bloom' : ''}`}
        onClick={handleClick}
        style={{ width: '100px', height: '300px', marginLeft: '-50px' }}
      >
        {/* SVG Flower graphics */}
        <svg viewBox="0 0 100 300" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="petalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF200" />
              <stop offset="70%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5C4033" />
              <stop offset="80%" stopColor="#3E2723" />
              <stop offset="100%" stopColor="#2D1A11" />
            </radialGradient>
            <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="50%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>

          {/* Stem */}
          <path 
            d="M50,80 Q50,150 45,300" 
            stroke="url(#stemGradient)" 
            strokeWidth="6" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* Leaves */}
          <path d="M48,160 Q20,150 15,130 Q30,120 49,150" fill="#4CAF50" />
          <path d="M47,200 Q80,180 85,150 Q70,140 48,190" fill="#388E3C" />

          {/* Petals */}
          <g transform="translate(0, 0)">
            {petals}
          </g>

          {/* Flower Center */}
          <circle cx="50" cy="50" r="15" fill="url(#centerGradient)" />
          
          {/* Center Details (seeds) */}
          <circle cx="50" cy="50" r="10" fill="none" stroke="#8D6E63" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
          <circle cx="50" cy="50" r="5" fill="none" stroke="#8D6E63" strokeWidth="1" strokeDasharray="1,2" opacity="0.6"/>
        </svg>

        {/* Particles rendered on top of the flower */}
        {particles.map(p => (
          <Particle 
            key={p.id} 
            id={p.id} 
            x={50 + p.offsetX} 
            y={50 + p.offsetY} 
            symbol={p.symbol}
            onComplete={removeParticle} 
          />
        ))}
      </div>
    </div>
  );
};

// Main Application Component
export default function App() {
  // Define the arrangement of the bouquet
  const flowerArrangement = [
    { x: 30, y: 10, rotation: -20, scale: 0.8, anim: 'animate-sway-left', delay: 0 },
    { x: 70, y: 10, rotation: 25, scale: 0.85, anim: 'animate-sway-right', delay: 0.5 },
    { x: 20, y: 20, rotation: -35, scale: 0.7, anim: 'animate-sway-left', delay: 1.2 },
    { x: 80, y: 20, rotation: 40, scale: 0.75, anim: 'animate-sway-right', delay: 0.8 },
    { x: 40, y: 25, rotation: -10, scale: 1.1, anim: 'animate-sway-center', delay: 0.2 },
    { x: 60, y: 25, rotation: 15, scale: 1.0, anim: 'animate-sway-center', delay: 0.7 },
    { x: 50, y: 35, rotation: 0, scale: 1.3, anim: 'animate-sway-center', delay: 0.4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-yellow-50 flex flex-col items-center justify-center overflow-hidden relative font-sans">
      <style>{globalStyles}</style>
      
      {/* Ambient background particles (pollen/light) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-yellow-300 blur-sm"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-up ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center mb-10 mt-10 p-4">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-600 drop-shadow-sm mb-3">
          Feliz primavera 💛
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-md mx-auto bg-white/50 p-3 rounded-2xl backdrop-blur-sm shadow-sm">
          Haz clic o toca las flores para verlas brillar.
        </p>
      </div>

      {/* Bouquet Container */}
      <div className="relative w-full max-w-lg h-[50vh] min-h-[400px] flex-grow flex items-end justify-center mb-10">
        
        {/* Vase / Ribbon (Optional decorative element at the base) */}
        <div className="absolute bottom-0 w-32 h-16 bg-gradient-to-b from-yellow-700/20 to-transparent rounded-t-full -mb-8 z-0 blur-md"></div>
        
        <div className="absolute w-full h-full">
          {flowerArrangement.map((flower, index) => (
            <Flower 
              key={index}
              x={flower.x}
              y={flower.y}
              rotation={flower.rotation}
              scale={flower.scale}
              animationClass={flower.anim}
              delay={flower.delay}
            />
          ))}
        </div>
        
        {/* Ribbon wrapping the stems */}
        <div className="absolute bottom-10 z-20 pointer-events-none">
           <svg width="120" height="60" viewBox="0 0 120 60">
             <path d="M10,30 Q60,50 110,30 Q60,10 10,30 Z" fill="#E91E63" opacity="0.9" />
             <path d="M30,35 Q10,60 5,55 Q20,30 30,35 Z" fill="#C2185B" opacity="0.9" />
             <path d="M90,35 Q110,60 115,55 Q100,30 90,35 Z" fill="#C2185B" opacity="0.9" />
           </svg>
        </div>
      </div>
    </div>
  );
}
