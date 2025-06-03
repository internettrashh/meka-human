import React, { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  hover?: boolean;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}—=+*^?#________';

export const TextScramble: React.FC<TextScrambleProps> = ({ text, className = '', hover = false }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const frameRequest = useRef<number>();
  const frame = useRef(0);
  const queue = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);

  useEffect(() => {
    if (hover && isHovered) {
      setQueue(text);
    } else if (!hover) {
      setQueue(text);
    }
  }, [text, hover, isHovered]);

  const setQueue = (newText: string) => {
    const oldText = displayText;
    const length = Math.max(oldText.length, newText.length);
    queue.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.current.push({ from, to, start, end });
    }

    cancelAnimationFrame(frameRequest.current!);
    frame.current = 0;
    update();
  };

  const update = () => {
    let output = '';
    let complete = 0;
    for (let i = 0, n = queue.current.length; i < n; i++) {
      let { from, to, start, end, char } = queue.current[i];
      if (frame.current >= end) {
        complete++;
        output += to;
      } else if (frame.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar();
          queue.current[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }
    setDisplayText(output);
    if (complete < queue.current.length) {
      frameRequest.current = requestAnimationFrame(update);
      frame.current++;
    }
  };

  const randomChar = () => {
    return characters[Math.floor(Math.random() * characters.length)];
  };

  return (
    <span 
      className={className}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
    >
      {displayText}
    </span>
  );
}; 