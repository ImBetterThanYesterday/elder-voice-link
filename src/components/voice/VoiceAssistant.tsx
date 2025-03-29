
import { useEffect, useState } from 'react';

interface VoiceAssistantProps {
  agentId: string;
  className?: string;
}

const VoiceAssistant = ({ agentId, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // This is a placeholder for capturing the subtitles from ElevenLabs
    // In a real implementation, we'd use the ElevenLabs API events to capture this
    
    // Setup event listeners for the ElevenLabs widget
    const setupEventListeners = () => {
      // Check if the ElevenLabs widget exists and is mounted
      const widgetInterval = setInterval(() => {
        const widgetElement = document.querySelector('elevenlabs-convai');
        if (widgetElement) {
          clearInterval(widgetInterval);
          
          // Listen to widget events
          widgetElement.addEventListener('message', (event: any) => {
            // Handle events from the widget
            const message = event.detail;
            
            if (message.type === 'speaking') {
              setIsSpeaking(true);
              setSubtitleText(message.text || '');
            } else if (message.type === 'speakingEnd') {
              setIsSpeaking(false);
            } else if (message.type === 'listening') {
              setIsListening(true);
              setSubtitleText('Listening...');
            } else if (message.type === 'listeningEnd') {
              setIsListening(false);
            }
          });
          
          console.log('ElevenLabs widget event listeners set up');
        }
      }, 1000);
      
      return () => clearInterval(widgetInterval);
    };
    
    setupEventListeners();
  }, []);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      {/* The ElevenLabs widget */}
      <elevenlabs-convai 
        agent-id={agentId} 
        className="w-full"
      ></elevenlabs-convai>
      
      {/* Large subtitle display for the elderly */}
      <div className={`subtitles-container mt-6 p-4 bg-white rounded-lg shadow-lg border-2 border-elder-primary w-full max-w-2xl transition-all duration-300 ${(isSpeaking || isListening) ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-elder-xl text-center font-medium text-elder-text">
          {subtitleText}
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
