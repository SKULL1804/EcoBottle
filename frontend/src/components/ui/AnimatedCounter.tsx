"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: string;
}

export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Parse the numeric part and the suffix from the string
  // Examples: "10K+" -> num=10, suffix="K+", "500kg" -> num=500, suffix="kg"
  const numericMatch = value.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const suffix = value.replace(/[\d.]+/, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Trigger when 30% of the element is visible
      { threshold: 0.3 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || numericValue === 0) return;

    let startTime: number;
    const duration = 2500; // 2.5 seconds spin up

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart curve to make numbers spin fast then slow down gracefully at the end
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      setCount(easeOut * numericValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, numericValue]);

  // Round numbers so we don't have crazy decimals flying, unless the original number had a decimal
  const displayCount = numericValue % 1 === 0 ? Math.floor(count) : count.toFixed(1);

  return (
    <div ref={elementRef} className="inline-block tabular-nums">
      {numericMatch ? `${displayCount}${suffix}` : value}
    </div>
  );
}
