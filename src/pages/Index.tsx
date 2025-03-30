
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-8 px-4">
        <div className="flex-1"></div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-2 text-gradient-blue">
              What Can I Do for<br />You Today?
            </h1>
          </div>

          <VoiceAssistant
            agentId={agentId}
            apiKey={apiKey}
            className="w-full"
          />
        </div>
        
        <div className="flex-1 flex items-end justify-center mt-8">
          <p className="text-xs text-gray-400 opacity-70">
            Grand AI - Your assistant and friend
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
