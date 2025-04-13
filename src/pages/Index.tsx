import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // ElevenLabs API Key
  const apiKey = "sk_a7d09d4d71312f96a63707e43614f4c8761f623db83654f9";

  useEffect(() => {
    const validateParams = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');

      if (!token || !userId) {
        setError('Token y userId son requeridos');
        setIsLoading(false);
        return;
      }

      try {
        // Simular validación del token
        const isTokenValid = await new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });

        toast({
          title: "Token validado",
          description: "Token validado correctamente",
          variant: "default",
        })

        // Simular validación del userId
        const isUserIdValid = await new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });
        
        toast({
          title: "Usuario validado",
          description: "Usuario validado correctamente",
          variant: "default",
        })
        
        
        await new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });

        if (isTokenValid && isUserIdValid) {
          setIsValid(true);
          console.log('Inicio de sesión correcto');
        } else {
          setError('Credenciales inválidas');
        }
      } catch (err) {
        setError('Error en la validación');
      } finally {
        setIsLoading(false);
      }
    };

    validateParams();
  }, [searchParams]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
          <div className="text-white text-xl">Validando credenciales...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </MainLayout>
    );
  }

  if (!isValid) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900">
          <div className="text-white text-xl">Acceso no autorizado</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-8 px-4">
        <div className="flex-1"></div>
        
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-2 text-gradient-blue">
              Hey there! How can I<br />help you today?
            </h1>
            <p className="text-lg text-blue-300 mt-3">
              I'm your friendly AI assistant, ready to chat
            </p>
          </div>

          <VoiceAssistant
            apiKey={apiKey}
            className="w-full"
          />
        </div>
        
        <div className="flex-1 flex items-end justify-center mt-8">
          <p className="text-xs text-gray-400 opacity-70">
            Grand AI - Your personal assistant, always here for you
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
