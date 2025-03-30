
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
  const [subtitleText, setSubtitleText] = useState('Tap the mic to start talking with me');
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState('');

  // Use the conversation hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setSubtitleText('I\'m listening! What\'s on your mind?');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setSubtitleText('Chat ended. Tap the mic when you\'re ready to talk again');
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
            
            setSubtitleText('I\'m listening...');
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
              setSubtitleText('What else would you like to talk about?');
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
      setSubtitleText('Oops! Something went wrong. Please try again.' + 
        (error && typeof error === 'object' && 'message' in error ? ' ' + String(error.message) : ''));
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
      setSubtitleText('I need microphone access to hear you. Please allow mic access and try again.');
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setSubtitleText('Chat paused. Tap the mic when you\'re ready to continue');
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
        {subtitleText && subtitleText !== 'Tap the mic to start talking with me' && (
          <div className="text-center text-sm text-blue-300 animate-pulse">
            {subtitleText}
          </div>
        )}

        {/* Minimal chat history only when there are messages - shown as floating info */}
        {chatHistory.length > 0 && streamingText && (
          <div className="text-center text-blue-300 text-sm">
            <span className="animate-pulse">Grand AI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
