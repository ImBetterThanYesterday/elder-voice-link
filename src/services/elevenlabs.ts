
/**
 * ElevenLabs API service
 * Handles speech-to-text and text-to-speech functionality
 */

// Helper function to remove or replace URLs in text for speaking
const prepareTextForSpeech = (text: string): string => {
  // Replace URLs with a more speakable phrase
  return text.replace(/(https?:\/\/[^\s]+)/g, 'Enlace proporcionado en el texto');
};

export const convertSpeechToText = async (audioBlob: Blob, apiKey: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model_id', 'scribe_v1');
  
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
      throw new Error(`La conversión de voz a texto falló: ${JSON.stringify(errorData.detail || response.statusText)}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error de voz a texto:', error);
    throw error;
  }
};

export const convertTextToSpeech = async (text: string, apiKey: string): Promise<Blob> => {
  try {
    // Prepare text for speech by handling URLs
    const processedText = prepareTextForSpeech(text);
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/4ClPfGRNxnfy7Zzp4OId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: processedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`La conversión de texto a voz falló: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error de texto a voz:', error);
    throw error;
  }
};
