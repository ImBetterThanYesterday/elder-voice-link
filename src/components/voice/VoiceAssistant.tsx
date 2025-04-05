
import { useState, useRef, useCallback } from 'react';
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
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
  }

  const handleAudioProcessing = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setSubtitleText('Processing your message...');
      
      const transcribedText = await convertSpeechToText(audioBlob, apiKey);
      
      if (transcribedText) {
        setUserMessage(transcribedText);
        
        setChatHistory(prev => [...prev, {
          text: transcribedText,
          isUser: true,
          timestamp: new Date()
        }]);
        
        setSubtitleText('Processing with Grand AI...');
        
        const aiResponse = await sendToN8N(transcribedText);
        
        if (aiResponse) {
          setChatHistory(prev => [...prev, {
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          }]);
          
          setSubtitleText('Grand AI is speaking...');
          
          const audioBlob = await convertTextToSpeech(aiResponse, apiKey);
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.onended = () => {
              URL.revokeObjectURL(audioUrl);
              setSubtitleText('What else would you like to talk about?');
            };
            await audioRef.current.play();
          }
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
        />
      </div>
    </div>
  );
};

export default VoiceAssistant;
