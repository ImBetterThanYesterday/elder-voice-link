/**
 * ElevenLabs API service
 * Handles speech-to-text and text-to-speech functionality
 */

import { currentEnvironment } from "../utils/endpoints";

// LocalStorage key for TTS preference
const TTS_PREFERENCE_KEY = "tts_preference";

// Helper function to remove or replace URLs in text for speaking
const prepareTextForSpeech = (text: string): string => {
  // Replace URLs with a more speakable phrase
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    "Enlace proporcionado en el texto"
  );
};

// Browser's built-in text-to-speech function
const useBrowserTextToSpeech = (text: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new SpeechSynthesisUtterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language to Spanish
      utterance.lang = "es-ES";

      // Create a MediaRecorder to capture the audio
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const mediaStreamDestination =
        audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);

      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        resolve(audioBlob);
      };

      // Start recording
      mediaRecorder.start();

      // Speak the text
      window.speechSynthesis.speak(utterance);

      // Stop recording when speech is complete
      utterance.onend = () => {
        mediaRecorder.stop();
      };

      utterance.onerror = (error) => {
        reject(
          new Error(`Error en la síntesis de voz del navegador: ${error.error}`)
        );
      };
    } catch (error) {
      reject(
        new Error(
          `Error al inicializar la síntesis de voz del navegador: ${error}`
        )
      );
    }
  });
};

// Get TTS preference from localStorage
export const getTTSPreference = (): "browser" | "elevenlabs" => {
  if (typeof window === "undefined") return "elevenlabs";

  // In production, always use ElevenLabs
  if (currentEnvironment === "prod") return "elevenlabs";

  // Get preference from localStorage or default to browser
  const preference = localStorage.getItem(TTS_PREFERENCE_KEY);
  return preference === "elevenlabs" ? "elevenlabs" : "browser";
};

// Set TTS preference in localStorage
export const setTTSPreference = (
  preference: "browser" | "elevenlabs"
): void => {
  if (typeof window === "undefined") return;

  // Don't allow changing in production
  if (currentEnvironment === "prod") return;

  localStorage.setItem(TTS_PREFERENCE_KEY, preference);
};

export const convertSpeechToText = async (
  audioBlob: Blob,
  apiKey: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model_id", "scribe_v1");

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Error desconocido" }));
      throw new Error(
        `La conversión de voz a texto falló: ${JSON.stringify(
          errorData.detail || response.statusText
        )}`
      );
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Error de voz a texto:", error);
    throw error;
  }
};

export const convertTextToSpeech = async (
  text: string,
  apiKey: string
): Promise<Blob> => {
  try {
    // Prepare text for speech by handling URLs
    const processedText = prepareTextForSpeech(text);

    if (currentEnvironment !== "prod") {
      // Get TTS preference
      const ttsPreference = getTTSPreference();

      // Use browser's built-in text-to-speech if preferred
      if (ttsPreference === "browser") {
        console.log("Usando síntesis de voz del navegador");
        return useBrowserTextToSpeech(processedText);
      }
    }

    // Use ElevenLabs API
    console.log("Usando ElevenLabs API");
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/4ClPfGRNxnfy7Zzp4OId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: processedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `La conversión de texto a voz falló: ${response.statusText}`
      );
    }

    return await response.blob();
  } catch (error) {
    console.error("Error de texto a voz:", error);
    throw error;
  }
};
