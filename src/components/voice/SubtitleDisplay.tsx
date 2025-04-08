
import React from 'react';
import LinkDisplay from './LinkDisplay';

interface SubtitleDisplayProps {
  text: string;
  isActive: boolean;
}

const SubtitleDisplay = ({ text, isActive }: SubtitleDisplayProps) => {
  return (
    <div className={`text-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm max-w-2xl mx-auto mt-4 ${isActive ? 'animate-pulse' : ''}`}>
      <div className="text-lg text-white">
        <LinkDisplay text={text} />
      </div>
    </div>
  );
};

export default SubtitleDisplay;
