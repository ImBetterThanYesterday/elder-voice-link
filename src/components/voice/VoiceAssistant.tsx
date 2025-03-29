
import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';

interface VoiceAssistantProps {
  agentId: string;
  apiKey: string;
  className?: string;
}

const VoiceAssistant = ({ agentId, apiKey, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const widgetRef = useRef<HTMLElement | null>(null);

  // Función para iniciar/detener la conversación
  const toggleConversation = () => {
    console.log("Toggling conversation, current state:", isListening);
    
    const widget = widgetRef.current;
    if (!widget) {
      console.error("Widget not found");
      return;
    }
    
    if (isListening) {
      console.log("Stopping listening");
      // La forma de detener depende de la implementación específica de ElevenLabs
      widget.dispatchEvent(new CustomEvent('stop'));
      setIsListening(false);
      setSubtitleText('');
    } else {
      console.log("Starting listening");
      widget.dispatchEvent(new CustomEvent('start'));
      setIsListening(true);
      setSubtitleText('Escuchando...');
    }
  };

  useEffect(() => {
    // Setup event listeners for the ElevenLabs widget
    const setupEventListeners = () => {
      console.log("Setting up event listeners for ElevenLabs widget");
      
      // Check if the ElevenLabs widget exists and is mounted
      const widgetInterval = setInterval(() => {
        const widgetElement = document.querySelector('elevenlabs-convai');
        if (widgetElement) {
          clearInterval(widgetInterval);
          widgetRef.current = widgetElement;
          
          // Listen to widget events
          widgetElement.addEventListener('message', (event: any) => {
            // Handle events from the widget
            const message = event.detail;
            console.log("Received message from widget:", message);
            
            if (message.type === 'speaking') {
              setIsSpeaking(true);
              setSubtitleText(message.text || '');
            } else if (message.type === 'speakingEnd') {
              setIsSpeaking(false);
            } else if (message.type === 'listening') {
              setIsListening(true);
              setSubtitleText('Escuchando...');
            } else if (message.type === 'listeningEnd') {
              setIsListening(false);
              setSubtitleText('');
            } else if (message.type === 'error') {
              console.error("Error from ElevenLabs widget:", message);
              setSubtitleText('Error: ' + (message.error || 'Ocurrió un error'));
            }
          });
          
          // Mark as initialized
          setIsInitialized(true);
          console.log('ElevenLabs widget event listeners set up');
        }
      }, 1000);
      
      return () => clearInterval(widgetInterval);
    };
    
    setupEventListeners();
  }, []);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      {/* ElevenLabs widget configurado con la API key */}
      <elevenlabs-convai 
        agent-id={agentId}
        api-key={apiKey}
        className="hidden"
      ></elevenlabs-convai>
      
      {/* Modern interface inspired by the provided image */}
      <div className="relative flex flex-col items-center w-full max-w-sm mx-auto">
        {/* Gradient orb visualization - AHORA CLICKABLE */}
        <div 
          className={`relative w-64 h-64 rounded-full mb-8 transition-all duration-500 cursor-pointer ${isListening || isSpeaking ? 'scale-110' : 'scale-100'}`}
          onClick={toggleConversation}
          role="button"
          aria-label={isListening ? "Detener escucha" : "Iniciar conversación"}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-teal-300 rounded-full blur-sm"></div>
          <div className="absolute inset-1 bg-gradient-to-tr from-fuchsia-400 via-blue-500 to-teal-400 rounded-full"></div>
          
          <div className={`absolute inset-0 flex items-center justify-center rounded-full ${isListening ? 'animate-pulse' : ''}`}>
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
            {isListening ? 'Escuchando...' : (isSpeaking ? 'Hablando...' : 'Listo')}
          </div>
        </div>
        
        {/* Microphone button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-lime-400 text-black' : 'bg-lime-400/90 text-black'}`}
            onClick={toggleConversation}
            aria-label={isListening ? "Detener escucha" : "Iniciar conversación"}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800/70 text-white"
            aria-label="Mostrar mensajes"
          >
            <MessageSquare size={20} />
          </button>
        </div>
        
        {/* Subtítulos más grandes y siempre visibles para personas mayores */}
        <div className={`subtitles-container mt-6 p-4 bg-black/80 text-white rounded-lg w-full max-w-md transition-all duration-300 min-h-[80px] flex items-center justify-center ${subtitleText ? 'opacity-100' : 'opacity-70'}`}>
          <p className="text-2xl text-center font-medium">
            {subtitleText || 'Presiona el círculo o el micrófono para hablar'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
