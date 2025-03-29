import { useCallback, useState } from 'react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface VoiceAssistantProps {
  agentId: string;
  apiKey: string;
  className?: string;
}

const VoiceAssistant = ({ agentId, apiKey, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('Presiona el círculo o el micrófono para hablar');
  const [userMessage, setUserMessage] = useState('');

  const conversation = useConversation({
    onConnect: () => {
      console.log('Conectado a ElevenLabs');
      setSubtitleText('Conectado. Esperando su consulta...');
    },
    onDisconnect: () => {
      console.log('Desconectado de ElevenLabs');
      setSubtitleText('Presiona el círculo o el micrófono para hablar');
    },
    onMessage: (message) => {
      console.log('Mensaje recibido:', message);
      
      if (message.type === 'agentResponse') {
        setSubtitleText(message.text || '');
      } else if (message.type === 'transcription') {
        setUserMessage(message.text || '');
        setSubtitleText('Escuchando...');
      } else if (message.type === 'agentResponseFinished') {
        setTimeout(() => {
          if (subtitleText === message.text) {
            setSubtitleText('¿En qué más puedo ayudarle?');
          }
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('Error en conversación:', error);
      setSubtitleText('Error: ' + (error.message || 'Ocurrió un error'));
    }
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: agentId, 
      });
      
      console.log("Conversación iniciada con agentId:", agentId);
    } catch (error) {
      console.error('No se pudo iniciar la conversación:', error);
      setSubtitleText('Error: No se pudo acceder al micrófono');
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setSubtitleText('Conversación finalizada');
  }, [conversation]);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="relative flex flex-col items-center w-full max-w-sm mx-auto">
        <div 
          className={`relative w-64 h-64 rounded-full mb-8 transition-all duration-500 cursor-pointer ${conversation.status === 'connected' ? 'scale-110' : 'scale-100'}`}
          onClick={conversation.status === 'connected' ? stopConversation : startConversation}
          role="button"
          aria-label={conversation.status === 'connected' ? "Detener conversación" : "Iniciar conversación"}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-teal-300 rounded-full blur-sm"></div>
          <div className="absolute inset-1 bg-gradient-to-tr from-fuchsia-400 via-blue-500 to-teal-400 rounded-full"></div>
          
          <div className={`absolute inset-0 flex items-center justify-center rounded-full ${conversation.status === 'connected' ? 'animate-pulse' : ''}`}>
            <div className="w-[95%] h-[95%] bg-black rounded-full flex items-center justify-center">
              <div className={`w-full h-full bg-gradient-to-bl from-violet-500 via-indigo-400 to-teal-300 rounded-full opacity-90 flex items-center justify-center transition-all duration-700 ${conversation.status === 'connected' ? 'animate-pulse scale-[0.97]' : 'scale-[0.92]'}`}>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-2 left-0 right-0 text-center">
          <div className="inline-flex items-center bg-lime-400 text-black text-sm px-3 py-1 rounded-full font-medium">
            <span className={`w-2 h-2 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-900' : 'bg-black'}`}></span>
            {conversation.status === 'connected' 
              ? (conversation.isSpeaking ? 'Hablando...' : 'Escuchando...') 
              : 'Desconectado'}
          </div>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button 
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${conversation.status === 'connected' ? 'bg-lime-400 text-black' : 'bg-lime-400/90 text-black'}`}
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            aria-label={conversation.status === 'connected' ? "Detener conversación" : "Iniciar conversación"}
          >
            {conversation.status === 'connected' ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-800/70 text-white"
            aria-label="Mostrar mensajes"
          >
            <MessageSquare size={20} />
          </button>
        </div>
        
        <div className={`subtitles-container mt-6 p-4 bg-black/80 text-white rounded-lg w-full max-w-md transition-all duration-300 min-h-[80px] flex items-center justify-center ${subtitleText ? 'opacity-100' : 'opacity-70'}`}>
          <p className="text-2xl text-center font-medium">
            {subtitleText || 'Presiona el círculo o el micrófono para hablar'}
          </p>
        </div>

        {userMessage && conversation.status === 'connected' && !conversation.isSpeaking && (
          <div className="mt-4 p-3 bg-gray-800/50 text-gray-300 rounded-lg w-full max-w-md text-xl text-center italic">
            "{userMessage}"
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
