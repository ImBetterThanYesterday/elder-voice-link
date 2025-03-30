
import { useCallback, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface VoiceAssistantProps {
  agentId: string;
  apiKey: string;
  className?: string;
}

const VoiceAssistant = ({ agentId, apiKey, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('Press the microphone to talk');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState('');

  // Use the conversation hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setSubtitleText('Connected. Waiting for your query...');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setSubtitleText('Conversation ended');
      setStreamingText('');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      
      // Handle different message types based on the ElevenLabs API structure
      if (typeof message === 'object' && message !== null) {
        if ('type' in message) {
          const typedMessage = message as any; // Type assertion for flexibility
          
          if (typedMessage.type === 'agentResponse') {
            // Update streaming text for real-time display
            setStreamingText(prev => prev + (typedMessage.text || ''));
            setSubtitleText(typedMessage.text || '');
          } 
          else if (typedMessage.type === 'transcription') {
            const transcribedText = typedMessage.text || '';
            setUserMessage(transcribedText);
            
            // Add user message to chat history
            if (transcribedText) {
              setChatHistory(prev => [...prev, {
                text: transcribedText,
                isUser: true,
                timestamp: new Date()
              }]);
            }
            
            setSubtitleText('Listening...');
          } 
          else if (typedMessage.type === 'agentResponseFinished') {
            // Add assistant response to chat history
            setChatHistory(prev => [...prev, {
              text: streamingText,
              isUser: false,
              timestamp: new Date()
            }]);
            
            // Reset streaming text
            setStreamingText('');
            
            setTimeout(() => {
              setSubtitleText('What else can I help you with?');
            }, 1000);
          }
        } 
        else if ('message' in message) {
          // Handle standard message format
          const messageStr = typeof message.message === 'string' ? message.message : '';
          setSubtitleText(messageStr);
        }
      }
    },
    onError: (error) => {
      console.error('Error in conversation:', error);
      setSubtitleText('Error: ' + (error && typeof error === 'object' && 'message' in error ? String(error.message) : 'An error occurred'));
    }
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: agentId, 
      });
      
      console.log("Conversation started with agentId:", agentId);
    } catch (error) {
      console.error('Could not start the conversation:', error);
      setSubtitleText('Error: Could not access the microphone');
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setSubtitleText('Conversation ended');
  }, [conversation]);

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full flex flex-col items-center justify-center space-y-10">
        {/* Energy ring effect with microphone button */}
        <div className="energy-ring">
          <button 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 
              ${conversation.status === 'connected' ? 'bg-[#00c2ff]/20 border-[#00c2ff]/30' : 'bg-black/30 border-[#00c2ff]/10'} 
              border-2 glow-button ${conversation.status === 'connected' ? 'active' : ''}`}
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            aria-label={conversation.status === 'connected' ? "Stop conversation" : "Start conversation"}
          >
            <div className="relative z-10">
              {conversation.status === 'connected' ? 
                <MicOff size={32} className="text-[#00c2ff]" /> : 
                <Mic size={32} className="text-[#00c2ff]" />
              }
            </div>
          </button>
        </div>
        
        {/* Text display area - shown minimally */}
        {subtitleText && subtitleText !== 'Press the microphone to talk' && (
          <div className="text-center text-sm text-gray-400 animate-pulse">
            {subtitleText}
          </div>
        )}

        {/* Minimal chat history only when there are messages - shown as floating info */}
        {chatHistory.length > 0 && streamingText && (
          <div className="text-center text-gray-400 text-sm">
            <span className="animate-pulse">Grand AI is listening...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
