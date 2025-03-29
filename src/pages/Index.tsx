
import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { ElderButton } from "@/components/ui/elder-button";
import { FeatureCard } from "@/components/features/FeatureCard";
import { Bell, Calendar, MessageCircle } from "lucide-react";

const Index = () => {
  // ElevenLabs Agent ID
  const agentId = "vOT8ib1IlJTnHikNtiN7";

  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        <section className="text-center mb-12">
          <h1 className="text-elder-2xl font-bold text-elder-dark mb-4">
            Welcome to Elder Voice Link
          </h1>
          <p className="text-elder-xl max-w-3xl mx-auto text-elder-text">
            A simple voice assistant designed for older adults to stay connected with their families.
          </p>
        </section>

        <section className="mb-12 w-full max-w-4xl">
          <VoiceAssistant agentId={agentId} className="mb-8" />
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <ElderButton 
              variant="primary" 
              size="lg"
              onClick={() => {
                // In a real implementation, this would trigger a specific voice command
                console.log("Send message button clicked");
              }}
            >
              Send a Message
            </ElderButton>
            <ElderButton 
              variant="secondary" 
              size="lg"
              onClick={() => {
                // In a real implementation, this would trigger a specific voice command
                console.log("Set reminder button clicked");
              }}
            >
              Set a Reminder
            </ElderButton>
          </div>
        </section>

        <section className="w-full max-w-5xl">
          <h2 className="text-elder-xl font-bold text-center text-elder-dark mb-8">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Voice Messages" 
              description="Send voice messages to your family members with simple commands."
              icon={<MessageCircle />}
            />
            <FeatureCard 
              title="Medication Reminders" 
              description="Get timely reminders for your medications and appointments."
              icon={<Bell />}
            />
            <FeatureCard 
              title="Calendar Management" 
              description="Keep track of important dates and events with voice commands."
              icon={<Calendar />}
            />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
