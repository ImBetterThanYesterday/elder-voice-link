import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
        // Consultar el token en la base de datos
        const { data: tokenData, error: tokenError } = await supabase
          .from('token_logs')
          .select('*')
          .eq('generated_token', token)
          .eq('elder_id', userId)
          .eq('is_active', true)
          .single();

        console.log(tokenData, tokenError);

        if (tokenError) {
          throw new Error('Error al validar el token');
        }

        if (!tokenData) {
          setError('Token inválido o expirado');
          setIsLoading(false);
          return;
        }

        // Actualizar el token a inactivo
        // const { error: updateError } = await supabase
        //   .from('token_logs')
        //   .update({ is_active: false })
        //   .eq('generated_token', token);

        // if (updateError) {
        //   throw new Error('Error al actualizar el estado del token');
        // }

        toast({
          title: "Acceso validado",
          description: "Token validado correctamente",
          variant: "default",
        });

        setIsValid(true);
        console.log('Inicio de sesión correcto');
      } catch (err) {
        setError('Error en la validación');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    validateParams();
  }, [searchParams, toast]);

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
