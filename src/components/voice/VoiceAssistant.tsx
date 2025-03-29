
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
      setSubtitleText('Press the microphone to talk');
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
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubtitleText('Error: ' + errorMessage);
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
      <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
        {/* Status indicator */}
        <div className="inline-flex items-center bg-lime-400 text-black text-sm px-3 py-1 rounded-full font-medium">
          <span className={`w-2 h-2 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-900' : 'bg-black'}`}></span>
          {conversation.status === 'connected' 
            ? (conversation.isSpeaking ? 'Speaking...' : 'Listening...') 
            : 'Disconnected'}
        </div>
        
        {/* Chat history / transcript area */}
        <div className="w-full bg-black/80 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
          {chatHistory.length === 0 ? (
            <p className="text-gray-400 text-center">Your conversation will appear here</p>
          ) : (
            <div className="flex flex-col space-y-4">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`px-3 py-2 rounded-lg text-white ${msg.isUser ? 'bg-blue-900/60 ml-auto' : 'bg-purple-900/60'} max-w-[80%]`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs text-gray-400">
                    {msg.isUser ? 'You' : 'Grand AI'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Streaming text display */}
          {streamingText && (
            <div className="px-3 py-2 rounded-lg bg-purple-900/60 text-white mt-4 animate-pulse">
              <p>{streamingText}</p>
              <span className="text-xs text-gray-400">Grand AI · typing...</span>
            </div>
          )}
        </div>
        
        {/* Circle microphone button with gradient design */}
        <div className="mt-6 flex justify-center relative">
          <button 
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative
              ${conversation.status === 'connected' ? 
                'bg-gradient-to-r from-red-500 to-red-400 text-white' : 
                'bg-gradient-to-r from-lime-400 to-teal-300 text-black'}`}
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            aria-label={conversation.status === 'connected' ? "Stop conversation" : "Start conversation"}
          >
            {/* Add a glow effect */}
            <div className={`absolute inset-0 rounded-full blur-md opacity-50
              ${conversation.status === 'connected' ? 
                'bg-gradient-to-r from-red-500 to-red-400' : 
                'bg-gradient-to-r from-lime-400 to-teal-300'}`}>
            </div>
            
            <div className="relative z-10">
              {conversation.status === 'connected' ? <MicOff size={36} /> : <Mic size={36} />}
            </div>
          </button>
        </div>
        
        {/* Current message/subtitle display */}
        <div className="w-full text-center">
          <p className="text-xl font-medium text-white">
            {subtitleText || 'Press the microphone to talk'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
