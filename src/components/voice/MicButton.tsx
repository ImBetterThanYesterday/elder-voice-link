
import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const MicButton = ({ isRecording, isProcessing, onClick }: MicButtonProps) => {
  return (
    <div className="energy-ring">
      <button 
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 
          ${isRecording ? 'bg-[#00c2ff]/20 border-[#00c2ff]/30' : 'bg-black/30 border-[#00c2ff]/10'} 
          border-2 glow-button ${isRecording ? 'active' : ''}`}
        onClick={onClick}
        disabled={isProcessing}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        <div className="relative z-10">
          {isRecording ? 
            <MicOff size={32} className="text-[#00c2ff]" /> : 
            <Mic size={32} className="text-[#00c2ff]" />
          }
        </div>
      </button>
    </div>
  );
};

export default MicButton;
