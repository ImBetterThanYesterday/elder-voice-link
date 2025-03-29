
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";

const Index = () => {
  // ElevenLabs Agent ID
  const agentId = "vOT8ib1IlJTnHikNtiN7";

  return (
    <MainLayout>
      <div className="flex flex-col items-center min-h-[80vh] justify-center bg-black text-white">
        <section className="text-center mb-8">
          <h1 className="text-elder-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-teal-300">
            Elder Voice Link
          </h1>
          <p className="text-elder-base max-w-xs mx-auto text-gray-300">
            Your voice assistant companion
          </p>
        </section>

        <section className="w-full max-w-md">
          <VoiceAssistant agentId={agentId} className="mb-8" />
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
