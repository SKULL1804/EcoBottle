"use client";

import { useEffect, useState } from "react";

export default function InteractiveBlobs() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only activate cursor tracking on devices that support hover (dekstop)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsDesktop(true);
      
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };

      // Set initial position to center before tracking mouse
      setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <>
      <div
        className={`${
          isDesktop ? "fixed" : "absolute top-0 right-0"
        } w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary-fixed/20 rounded-full blur-[100px] md:blur-[140px] pointer-events-none z-0 transition-transform duration-[2500ms] ease-out will-change-transform`}
        style={
          isDesktop
            ? {
                left: 0,
                top: 0,
                transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
              }
            : {}
        }
      />
      <div
        className={`${
          isDesktop ? "fixed" : "absolute top-[30%] -left-32"
        } w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-surface-container-lowest/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-0 transition-transform duration-[3500ms] ease-out will-change-transform`}
        style={
          isDesktop
            ? {
                left: 0,
                top: 0,
                transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
              }
            : {}
        }
      />
    </>
  );
}
