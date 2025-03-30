
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
      setSubtitleText('Error: ' + (error && typeof error === 'object' && 'message' in error ? error.message : 'An error occurred'));
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
      <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6 bg-white rounded-xl p-6">
        {/* Larger microphone button with bright blue color */}
        <div className="flex flex-col items-center justify-center relative mb-4">
          <button 
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 
              bg-[#00c2ff] text-white shadow-lg hover:scale-105`}
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            aria-label={conversation.status === 'connected' ? "Stop conversation" : "Start conversation"}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-[#00c2ff]"></div>
            
            <div className="relative z-10">
              {conversation.status === 'connected' ? <MicOff size={36} /> : <Mic size={36} />}
            </div>
          </button>
        </div>
        
        {/* Current message/subtitle display with cleaner styling */}
        <div className="w-full text-center">
          <p className="text-lg font-medium text-gray-700">
            {subtitleText || 'Press the microphone to talk'}
          </p>
        </div>

        {/* Status indicators in a cleaner layout */}
        <div className="flex items-center justify-center space-x-6 text-sm mt-6">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-gray-600">Voice {conversation.status === 'connected' ? 'enabled' : 'disabled'}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">AI powered</span>
          </div>
        </div>
        
        {/* Only show chat history when there are messages */}
        {chatHistory.length > 0 && (
          <div className="w-full bg-gray-50 rounded-lg p-4 mt-4 max-h-[250px] overflow-y-auto border border-gray-200">
            <div className="flex flex-col space-y-4">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`px-3 py-2 rounded-lg ${msg.isUser ? 'bg-[#e0f7ff] ml-auto' : 'bg-[#f0f9ff]'} max-w-[80%] border border-gray-200`}
                >
                  <p className="text-gray-700">{msg.text}</p>
                  <span className="text-xs text-gray-400">
                    {msg.isUser ? 'You' : 'Grand AI'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Streaming text display */}
            {streamingText && (
              <div className="px-3 py-2 rounded-lg bg-[#f0f9ff] text-gray-700 mt-4 border border-gray-200">
                <p>{streamingText}</p>
                <span className="text-xs text-gray-400">Grand AI · typing...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
