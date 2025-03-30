
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs API Key and Agent ID
  const apiKey = "sk_aa411f2193444210a029eaa80ed22864d3928c3d22bd324a";
  const agentId = "vOT8ib1IlJTnHikNtiN7";

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[80vh] justify-center bg-gray-50 py-8">
        <section className="text-center mb-8">
          <h1 className="text-elder-2xl font-bold mb-2 text-gray-800">
            Grand AI
          </h1>
          <p className="text-elder-base max-w-xs mx-auto text-gray-600">
            Your assistant and Your friend
          </p>
        </section>

        <section className="w-full max-w-lg px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="py-3 px-4 bg-[#00c2ff] text-white flex items-center">
              <span className="text-sm font-medium">Interactive Demo</span>
            </div>
            <VoiceAssistant 
              agentId={agentId} 
              apiKey={apiKey} 
              className="p-6" 
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Experience our voice assistant technology firsthand. Ask questions, learn how it works, or explore features.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
