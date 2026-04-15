"use client";

import { useEffect, useState } from "react";

const BottleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
    <path d="M9.5 2h5v3a2 2 0 0 1 2 2v11a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4V7a2 2 0 0 1 2-2V2z" fill="#f0f9ff" opacity="0.4" />
    <path d="M8.5 3h7" strokeWidth="1.5" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
    <path d="M10 9h4" />
  </svg>
);

const CoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
    <circle cx="12" cy="12" r="10" fill="#FBBF24" />
    <circle cx="12" cy="12" r="8" stroke="#F59E0B" strokeWidth="1.5" fill="#FBBF24" />
    <text x="12" y="16" fontSize="12" fontWeight="900" fontStyle="italic" textAnchor="middle" fill="#FFFFFF" style={{ fontFamily: 'system-ui, sans-serif' }}>Rp</text>
  </svg>
);

interface Item {
  id: number;
  initialX: number; // percentage
  initialY: number; // percentage
  size: number;
  depth: number;
  rotation: number;
  delay: number;
  hideOnMobile?: boolean;
}

const ITEMS: Item[] = [
  { id: 1, initialX: 8, initialY: 15, size: 76, depth: 0.05, rotation: 15, delay: 0 },
  { id: 2, initialX: 88, initialY: 12, size: 84, depth: -0.04, rotation: -20, delay: 2 },
  { id: 3, initialX: 12, initialY: 65, size: 60, depth: 0.08, rotation: 45, delay: 1 },
  { id: 4, initialX: 85, initialY: 70, size: 56, depth: -0.06, rotation: -10, delay: 3 },
  { id: 5, initialX: 75, initialY: 35, size: 48, depth: 0.03, rotation: 30, delay: 0.5, hideOnMobile: true },
  { id: 6, initialX: 20, initialY: 40, size: 52, depth: -0.05, rotation: -35, delay: 2.5, hideOnMobile: true },
];

function FloatingItem({ item, mousePos }: { item: Item; mousePos: { x: number; y: number } }) {
  const [transformed, setTransformed] = useState(false);
  const [windowCenter, setWindowCenter] = useState({ x: 0, y: 0 });
  const [respawning, setRespawning] = useState(false);
  
  useEffect(() => {
    setWindowCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  const deltaX = (mousePos.x - windowCenter.x) * item.depth;
  const deltaY = (mousePos.y - windowCenter.y) * item.depth;

  const handleInteract = () => {
    if (transformed || respawning) return;
    setTransformed(true);
    
    // Morph and float up for 1.2s, then trigger respawn sequence
    setTimeout(() => {
      setRespawning(true);
      setTransformed(false);
      
      // Wait for out animation to finish, then respawn magically
      setTimeout(() => {
        setRespawning(false);
      }, 600);
    }, 1200);
  };

  return (
    <div
      className={`absolute ease-out will-change-transform z-10 ${item.hideOnMobile ? 'hidden md:block' : ''} ${
        respawning 
          ? 'opacity-0 scale-50 transition-all duration-500' 
          : 'opacity-100 scale-100 transition-all duration-1000'
      }`}
      style={{
        left: `${item.initialX}%`,
        top: `${item.initialY}%`,
        transform: `translate(${deltaX}px, ${deltaY}px)`,
      }}
    >
      <div 
        className="animate-bottle-float cursor-crosshair pointer-events-auto p-4 -m-4 scale-[0.7] md:scale-100 origin-center transition-transform duration-500" // Big hit area and scale down for mobile
        style={{ animationDelay: `${item.delay}s` }}
        onMouseEnter={handleInteract}
        onTouchStart={handleInteract}
      >
        <div 
          className="relative transition-all duration-700 flex items-center justify-center transform"
          style={{
            transform: transformed ? `translateY(-60px) scale(1.3)` : `rotate(${item.rotation}deg)`,
            width: '100px',
            height: '100px'
          }}
        >
          {/* Main Botol (if transformed, fades out quickly) */}
          <div 
            className="absolute m-auto text-primary/40 flex items-center justify-center transition-opacity duration-300" 
            style={{ 
              width: `${item.size}px`, 
              height: `${item.size}px`, 
              opacity: transformed ? 0 : 1 
            }}
          >
            <BottleIcon />
          </div>

          {/* Koin Mas (if transformed, pops in) */}
          <div 
            className="absolute m-auto flex items-center justify-center transition-all duration-500 ease-out" 
            style={{ 
              width: `${item.size + 15}px`, 
              height: `${item.size + 15}px`, 
              opacity: transformed ? 1 : 0,
              transform: transformed ? 'rotate(360deg) scale(1)' : 'rotate(0deg) scale(0)'
            }}
          >
            <CoinIcon />
          </div>
          
          {/* Floating +Rp Text */}
          <div 
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary-fixed bg-primary font-black text-sm px-3 py-1 rounded-full shadow-xl shadow-primary/20 transition-all duration-600ms pointer-events-none whitespace-nowrap"
            style={{
               opacity: transformed ? 1 : 0,
               transform: transformed ? 'translateY(-15px) scale(1.1)' : 'translateY(10px) scale(0.9)',
            }}
          >
            +Rp 50
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParallaxHeroInteract() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(false);
  
  useEffect(() => {
    setIsInteractive(true);
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    if (window.matchMedia("(hover: hover)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  if (!isInteractive) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bottle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        .animate-bottle-float {
          animation: bottle-float 6s ease-in-out infinite;
        }
      `}} />
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {ITEMS.map((item) => (
            <FloatingItem key={item.id} item={item} mousePos={mousePos} />
          ))}
        </div>
      </div>
    </>
  );
}
