"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Only apply tilt on devices that support hover
    if (window.innerWidth <= 768) return; 
    
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const maxRot = 8; // gentle rotation
    const rotateX = (0.5 - y) * maxRot * 2;
    const rotateY = (x - 0.5) * maxRot * 2;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-[400ms] will-change-transform ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotation({x:0, y:0}); }}
      style={{
        transform: isHovered && window.innerWidth > 768
          ? `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
          : `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glare Effect */}
      <div
        className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
        style={{
          borderRadius: 'inherit',
          opacity: isHovered && window.innerWidth > 768 ? 1 : 0,
          background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)`,
        }}
      />
      {/* Prevent content from flattening by translating it slightly forward in Z space */}
      <div className="relative w-full h-full" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </div>
  );
}
