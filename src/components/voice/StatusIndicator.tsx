
import React from 'react';
import SubtitleDisplay from './SubtitleDisplay';

interface StatusIndicatorProps {
  subtitleText: string;
  isProcessing: boolean;
  activeSpeech: string;
  isSpeaking: boolean;
}

const StatusIndicator = ({ 
  subtitleText, 
  isProcessing, 
  activeSpeech, 
  isSpeaking 
}: StatusIndicatorProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {subtitleText && subtitleText !== 'Tap the mic to start talking with me' && (
        <div className="text-center text-sm text-blue-300 animate-pulse">
          {subtitleText}
        </div>
      )}

      {isProcessing && (
        <div className="text-center text-blue-300 text-sm">
          <span className="animate-pulse">Link Voice is thinking...</span>
        </div>
      )}

      {activeSpeech && (
        <SubtitleDisplay text={activeSpeech} isActive={isSpeaking} />
      )}
    </div>
  );
};

export default StatusIndicator;
