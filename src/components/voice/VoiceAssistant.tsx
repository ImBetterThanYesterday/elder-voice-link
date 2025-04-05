
import { useCallback, useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio element for playback
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
  }

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsRecording(true);
      setSubtitleText('I\'m listening! What\'s on your mind?');
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          try {
            setIsProcessing(true);
            setSubtitleText('Processing your message...');
            
            // Convert audio to text using ElevenLabs speech-to-text API
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const transcribedText = await convertSpeechToText(audioBlob);
            
            if (transcribedText) {
              setUserMessage(transcribedText);
              
              // Add user message to chat history
              setChatHistory(prev => [...prev, {
                text: transcribedText,
                isUser: true,
                timestamp: new Date()
              }]);
              
              setSubtitleText('Processing with Grand AI...');
              
              // Send to N8N endpoint and get response
              const aiResponse = await sendToN8N(transcribedText);
              
              if (aiResponse) {
                // Add AI response to chat history
                setChatHistory(prev => [...prev, {
                  text: aiResponse,
                  isUser: false,
                  timestamp: new Date()
                }]);
                
                setSubtitleText('Grand AI is speaking...');
                
                // Convert text to speech and play it
                await convertTextToSpeech(aiResponse);
                
                setTimeout(() => {
                  setSubtitleText('What else would you like to talk about?');
                }, 1000);
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
        }
      };
      
      mediaRecorder.start();
    } catch (error) {
      console.error('Could not start recording:', error);
      setSubtitleText('I need microphone access to hear you. Please allow mic access and try again.');
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to use voice features",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Close the media stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setSubtitleText('Processing your audio...');
    }
  }, [isRecording]);
  
  // Function to convert speech to text using ElevenLabs API
  const convertSpeechToText = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('model_id', 'whisper-1');
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(`Speech to text failed: ${errorData.detail || response.statusText}`);
      }
      
      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Speech to text error:', error);
      throw error;
    }
  };
  
  // Function to send text to N8N endpoint
  const sendToN8N = async (text: string): Promise<string> => {
    try {
      const response = await fetch('https://n8n-pc98.onrender.com/webhook/76c09305-9123-4cfb-831e-4bceaa51a561', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text
        }),
      });
      
      if (!response.ok) {
        throw new Error(`N8N processing failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.output || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('N8N processing error:', error);
      throw error;
    }
  };
  
  // Function to convert text to speech using ElevenLabs API
  const convertTextToSpeech = async (text: string): Promise<void> => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Text to speech failed: ${response.statusText}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setSubtitleText('What else would you like to talk about?');
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Text to speech error:', error);
      throw error;
    }
  };

  return (
    <div className={`voice-assistant-container flex flex-col items-center ${className || ''}`}>
      <div className="w-full flex flex-col items-center justify-center space-y-10">
        {/* Energy ring effect with microphone button */}
        <div className="energy-ring">
          <button 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 
              ${isRecording ? 'bg-[#00c2ff]/20 border-[#00c2ff]/30' : 'bg-black/30 border-[#00c2ff]/10'} 
              border-2 glow-button ${isRecording ? 'active' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <div className="relative z-10">
              {isRecording ? 
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

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center text-blue-300 text-sm">
            <span className="animate-pulse">Grand AI is thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
