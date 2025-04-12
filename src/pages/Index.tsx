
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs API Key
  const apiKey = "sk_a7d09d4d71312f96a63707e43614f4c8761f623db83654f9";

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-8 px-4">
        <div className="flex-1"></div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-2 text-gradient-blue">
              ¡Hola! ¿Cómo puedo<br />ayudarte hoy?
            </h1>
            <p className="text-lg text-blue-300 mt-3">
              Soy tu asistente de IA, listo para conversar
            </p>
          </div>

          <VoiceAssistant
            apiKey={apiKey}
            className="w-full"
          />
        </div>
        
        <div className="flex-1 flex items-end justify-center mt-8">
          <p className="text-xs text-gray-400 opacity-70">
            Grand AI - Tu asistente personal, siempre aquí para ti
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
