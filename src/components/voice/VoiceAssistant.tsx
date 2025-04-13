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
  elderId: string;
}

const VoiceAssistant = ({ apiKey, className, elderId }: VoiceAssistantProps) => {
  const [subtitleText, setSubtitleText] = useState('Toca el micrófono para comenzar a hablar conmigo');
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
      const greetingMessage = "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?";
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
        console.error('Error reproduciendo saludo:', error);
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
      console.error('Error hablando texto:', error);
      setIsSpeaking(false);
    }
  };

  const handleAudioProcessing = useCallback(async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setSubtitleText('Procesando tu mensaje...');
      
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
        await speakText("Entiendo. Dame un momento para procesar tu solicitud.");
        
        setSubtitleText('Procesando con Grand AI...');
        
        // Get AI response
        const aiResponse = await sendToN8N(transcribedText, elderId);
        
        if (aiResponse) {
          setChatHistory(prev => [...prev, {
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          }]);
          
          setSubtitleText('Grand AI está hablando...');
          
          // Speak the response, displaying subtitles
          await speakText(aiResponse);
          
          setSubtitleText('¿De qué más te gustaría hablar?');
        }
      }
    } catch (error) {
      console.error('Error procesando audio:', error);
      if (error instanceof Error) {
        setSubtitleText('¡Ups! Algo salió mal. Por favor, inténtalo de nuevo. ' + error.message);
        toast({
          title: "Error",
          description: `El procesamiento falló: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setSubtitleText('¡Ups! Algo salió mal. Por favor, inténtalo de nuevo.');
        toast({
          title: "Error",
          description: "Ocurrió un error desconocido",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, toast, elderId]);

  const { isRecording, startRecording, stopRecording } = useVoiceRecording({
    onRecordingComplete: handleAudioProcessing
  });

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopRecording();
      setSubtitleText('Procesando tu audio...');
    } else {
      startRecording();
      setSubtitleText('Estoy escuchando. ¿Qué tienes en mente?');
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
