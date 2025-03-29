
import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  agentId: string;
  className?: string;
}

const VoiceAssistant = ({ agentId, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const widgetRef = useRef<HTMLElement | null>(null);
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  
  useEffect(() => {
    // Setup event listeners for the ElevenLabs widget
    const setupEventListeners = () => {
      // Check if the ElevenLabs widget exists and is mounted
      const widgetInterval = setInterval(() => {
        const widgetElement = document.querySelector('elevenlabs-convai');
        if (widgetElement) {
          widgetRef.current = widgetElement as HTMLElement;
          clearInterval(widgetInterval);
          
          // Listen to widget events
          widgetElement.addEventListener('message', (event: any) => {
            console.log('Widget event received:', event.detail);
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
            } else if (message.type === 'ready') {
              console.log('ElevenLabs widget is ready');
              toast.success("Voice assistant is ready!");
            } else if (message.type === 'error') {
              console.error('ElevenLabs widget error:', message);
              toast.error("Error: " + (message.message || 'Unknown error'));
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

  const handleMicrophoneClick = () => {
    if (!widgetRef.current) {
      toast.error("Voice assistant not ready. Please try again.");
      return;
    }
    
    try {
      if (isListening) {
        // If already listening, stop listening
        console.log('Stopping listening...');
        widgetRef.current.dispatchEvent(new CustomEvent('stopListening'));
        setIsListening(false);
      } else {
        // Request microphone access first
        console.log('Requesting microphone access...');
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            // Start listening
            console.log('Starting listening...');
            widgetRef.current?.dispatchEvent(new CustomEvent('startListening'));
            setIsListening(true);
          })
          .catch((err) => {
            console.error("Microphone access denied:", err);
            toast.error("Please allow microphone access to use the voice assistant");
          });
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toast.error("Something went wrong with the microphone");
    }
  };

  const handleOrbClick = () => {
    handleMicrophoneClick();
  };

  const handleMessageClick = () => {
    // Show conversation history or open a chat panel
    toast.info("Message history feature coming soon!");
  };

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      {/* Widget with API key */}
      {apiKey ? (
        <elevenlabs-convai 
          agent-id={agentId}
          api-key={apiKey}
          className="hidden"
        ></elevenlabs-convai>
      ) : (
        <div className="hidden">
          {toast.error("ElevenLabs API key is missing. Please add it to your .env file.")}
        </div>
      )}
      
      {/* Modern interface inspired by the provided image */}
      <div className="relative flex flex-col items-center w-full max-w-sm mx-auto">
        {/* Gradient orb visualization */}
        <div 
          className={`relative w-64 h-64 rounded-full mb-8 transition-all duration-500 ${isListening || isSpeaking ? 'scale-110' : 'scale-100'}`}
          onClick={handleOrbClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-teal-300 rounded-full blur-sm"></div>
          <div className="absolute inset-1 bg-gradient-to-tr from-fuchsia-400 via-blue-500 to-teal-400 rounded-full"></div>
          
          <div 
            className={`absolute inset-0 flex items-center justify-center rounded-full ${isListening ? 'animate-pulse' : ''} cursor-pointer`}
          >
            <div className="w-[95%] h-[95%] bg-black rounded-full flex items-center justify-center">
              <div className={`w-full h-full bg-gradient-to-bl from-violet-500 via-indigo-400 to-teal-300 rounded-full opacity-90 flex items-center justify-center transition-all duration-700 ${isListening ? 'animate-pulse scale-[0.97]' : 'scale-[0.92]'}`}>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-2 left-0 right-0 text-center">
          <div className="inline-flex items-center bg-lime-400 text-black text-sm px-3 py-1 rounded-full font-medium">
            <span className={`w-2 h-2 rounded-full mr-2 ${isListening || isSpeaking ? 'bg-green-900' : 'bg-black'}`}></span>
            {isListening ? 'Listening...' : (isSpeaking ? 'Speaking...' : 'Ready')}
          </div>
        </div>
        
        {/* Microphone button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-lime-400 text-black' : 'bg-lime-400/90 text-black'}`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            onClick={handleMicrophoneClick}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800/70 text-white"
            aria-label="Show messages"
            onClick={handleMessageClick}
          >
            <MessageSquare size={20} />
          </button>
        </div>
        
        {/* Large subtitle display for the elderly */}
        <div className={`subtitles-container mt-6 p-4 bg-black/80 text-white rounded-lg w-full max-w-md transition-all duration-300 ${(isSpeaking || isListening || subtitleText) ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-2xl text-center font-medium">
            {subtitleText || (isListening ? 'Listening...' : (isSpeaking ? 'Speaking...' : ''))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
