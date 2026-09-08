import React, { useEffect, useState } from 'react';

interface AsciiOrnamentProps {
  davidState: string;
  className?: string;
}

export const AsciiOrnament: React.FC<AsciiOrnamentProps> = ({ davidState, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let speed = 2000;
    if (davidState === 'SYNTHESIZING') speed = 150;
    else if (davidState === 'READY') speed = 1000;
    else if (davidState === 'COMPLETE') speed = 400;

    const t = setInterval(() => setFrame((f) => f + 1), speed);
    return () => clearInterval(t);
  }, [davidState]);

  const idleFrames = ['[ · - - ]', '[ - · - ]', '[ - - · ]', '[ - · - ]'];
  const readyFrames = ['< ◇ >', '< ◈ >'];
  const synthFrames = ['| ▚ |', '| ▞ |', '| ▚ |'];
  const completeFrames = ['[ ▣ ]', '[ □ ]'];
  const errorFrames = ['! × !', '× ! ×'];

  let frames = idleFrames;
  if (davidState === 'SYNTHESIZING') frames = synthFrames;
  else if (davidState === 'READY') frames = readyFrames;
  else if (davidState === 'COMPLETE') frames = completeFrames;
  else if (davidState === 'ERROR') frames = errorFrames;

  const currentFrame = frames[frame % frames.length];

  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest transition-opacity duration-300 ${className}`}>
      {currentFrame}
    </span>
  );
};
