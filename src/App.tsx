import { useState, useEffect } from 'react';

const Flower = ({ delay, onClick }: { delay: string, onClick: (e: React.MouseEvent) => void }) => (
  <div 
    className="relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
    onClick={onClick}
    style={{
      animation: `sway 4s ease-in-out infinite alternate ${delay}`,
      transformOrigin: 'bottom center'
    }}
  >
    {/* Tallo */}
    <svg className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-48 sm:h-64 z-0" viewBox="0 0 20 200">
      <path d="M10,0 Q15,100 10,200" stroke="#2d5a27" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Hojas */}
      <path d="M10,80 Q-15,70 0,40 Q10,60 10,80" fill="#4ade80" />
      <path d="M12,120 Q35,110 20,80 Q12,100 12,120" fill="#4ade80" />
    </svg>

    {/* Cabeza de la flor (Girasol) */}
    <svg className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 drop-shadow-xl" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5c3a21" />
          <stop offset="100%" stopColor="#2b160b" />
        </radialGradient>
      </defs>
      
      {/* Pétalos */}
      {[...Array(16)].map((_, i) => (
        <g key={i} style={{ transform: `rotate(${i * 22.5}deg)`, transformOrigin: '50px 50px' }}>
          <path d="M45,50 Q45,10 50,0 Q55,10 55,50" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1" />
        </g>
      ))}
      
      {/* Centro */}
      <circle cx="50" cy="50" r="18" fill="url(#centerGrad)" />
      
      {/* Detalles del centro */}
      {[...Array(12)].map((_, i) => (
        <circle 
          key={i} 
          cx={50 + Math.cos(i * 30 * Math.PI / 180) * 10} 
          cy={50 + Math.sin(i * 30 * Math.PI / 180) * 10} 
          r="1.5" 
          fill="#d97706" 
        />
      ))}
    </svg>
  </div>
);

// Aquí definimos los tipos que TypeScript te estaba pidiendo
const Particle = ({ x, y, symbol }: { id: number, x: number, y: number, symbol: string }) => {
  return (
    <div
      className="absolute pointer-events-none text-2xl select-none"
      style={{
        left: x,
        top: y,
        animation: `floatUp 1.5s ease-out forwards`,
      }}
    >
      {symbol}
    </div>
  );
};

export default function App() {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, symbol: string }[]>([]);

  // Estilos globales de animación inyectados dinámicamente
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes sway {
        0% { transform: rotate(-5deg); }
        100% { transform: rotate(5deg); }
      }
      @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
      }
      body {
        margin: 0;
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleFlowerClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newParticles = Array.from({ length: 5 }).map(() => ({
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() * 60 - 30) - 15,
      y: rect.top + rect.height / 2 + (Math.random() * 40 - 20) - 20,
      symbol: Math.random() > 0.5 ? '✨' : '💛'
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Limpiar las partículas después de que termine la animación
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="text-center mb-16 z-10 p-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2 font-serif">
          Feliz Primavera 💛
        </h1>
        <p className="text-blue-900 font-medium opacity-80 text-lg">
          Toca las flores para ver la magia :)
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-end gap-4 sm:gap-12 px-4 z-10 pb-20">
        <Flower delay="0s" onClick={handleFlowerClick} />
        <Flower delay="-1.5s" onClick={handleFlowerClick} />
        <Flower delay="-0.5s" onClick={handleFlowerClick} />
      </div>

      {/* Renderizado de partículas */}
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Suelo decorativo */}
      <div className="absolute bottom-0 w-full h-24 bg-green-600 rounded-t-[50%] scale-110 shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]"></div>
    </div>
  );
}