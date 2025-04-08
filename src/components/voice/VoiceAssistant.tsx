
import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { convertSpeechToText, convertTextToSpeech } from '@/services/elevenlabs';
import { sendToN8N } from '@/services/n8n';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import MicButton from './MicButton';
import StatusIndicator from './StatusIndicator';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface VoiceAssistantProps {
  apiKey: string;
  className?: string;
}

const VoiceAssistant = ({ apiKey, className }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('Tap the mic to start talking with me');
  const [activeSpeech, setActiveSpeech] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
  }

  // Play greeting message when component mounts
  useEffect(() => {
    const playGreeting = async () => {
      const greetingMessage = "Hello! I'm your AI assistant. How can I help you today?";
      try {
        const audioBlob = await convertTextToSpeech(greetingMessage, apiKey);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            URL.revokeObjectURL(audioUrl);
            setActiveSpeech('');
            setIsSpeaking(false);
          };
          setActiveSpeech(greetingMessage);
          setIsSpeaking(true);
          await audioRef.current.play();
        }
      } catch (error) {
        console.error('Error playing greeting:', error);
      }
    };

    setTimeout(() => {
      playGreeting();
    }, 1000);
  }, [apiKey]);

  // Function to synchronize text with speech
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      setActiveSpeech(text);
      
      const audioBlob = await convertTextToSpeech(text, apiKey);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const handleAudioProcessing = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setSubtitleText('Processing your message...');
      
      // Speech to text
      const transcribedText = await convertSpeechToText(audioBlob, apiKey);
      
      if (transcribedText) {
        setUserMessage(transcribedText);
        
        setChatHistory(prev => [...prev, {
          text: transcribedText,
          isUser: true,
          timestamp: new Date()
        }]);
        
        // Acknowledge user's message
        await speakText("I understand. Give me a moment to process your request.");
        
        setSubtitleText('Processing with Grand AI...');
        
        // Get AI response
        const aiResponse = await sendToN8N(transcribedText);
        
        if (aiResponse) {
          setChatHistory(prev => [...prev, {
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          }]);
          
          setSubtitleText('Grand AI is speaking...');
          
          // Speak the response, displaying subtitles
          await speakText(aiResponse);
          
          setSubtitleText('What else would you like to talk about?');
        }
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      if (error instanceof Error) {
        setSubtitleText('Oops! Something went wrong. Please try again. ' + error.message);
        toast({
          title: "Error",
          description: `Processing failed: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setSubtitleText('Oops! Something went wrong. Please try again.');
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, toast]);

  const { isRecording, startRecording, stopRecording } = useVoiceRecording({
    onRecordingComplete: handleAudioProcessing
  });

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopRecording();
      setSubtitleText('Processing your audio...');
    } else {
      startRecording();
      setSubtitleText('I\'m listening! What\'s on your mind?');
    }
  };

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full flex flex-col items-center justify-center space-y-10">
        <MicButton 
          isRecording={isRecording} 
          isProcessing={isProcessing} 
          onClick={handleMicButtonClick} 
        />
        
        <StatusIndicator 
          subtitleText={subtitleText} 
          isProcessing={isProcessing}
          activeSpeech={activeSpeech}
          isSpeaking={isSpeaking}
        />
      </div>
    </div>
  );
};

export default VoiceAssistant;
