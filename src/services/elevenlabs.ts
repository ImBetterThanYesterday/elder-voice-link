
/**
 * ElevenLabs API service
 * Handles speech-to-text and text-to-speech functionality
 */

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
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(`Speech to text failed: ${JSON.stringify(errorData.detail || response.statusText)}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Speech to text error:', error);
    throw error;
  }
};

export const convertTextToSpeech = async (text: string, apiKey: string): Promise<Blob> => {
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
    
    return await response.blob();
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
};
