import { MainLayout } from "@/components/layout/MainLayout";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { currentEnvironment, endpoints } from "@/utils/endpoints";
import { getTTSPreference, setTTSPreference } from "@/services/elevenlabs";
import Cookies from "js-cookie";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Settings } from "lucide-react";

const DEFAULT_ELDER_ID = import.meta.env.VITE_ELDER_ID;
const SESSION_COOKIE_NAME = "user_session";
const SESSION_EXPIRY_DAYS = 7;

const Index = () => {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elderId, setElderId] = useState(DEFAULT_ELDER_ID);
  const [customWebhookUrl, setCustomWebhookUrl] = useState("");
  const [ttsPreference, setTtsPreference] = useState<'browser' | 'elevenlabs'>('browser');
  const { toast } = useToast();

  // ElevenLabs API Key
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  // Load TTS preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTtsPreference(getTTSPreference());
    }
  }, []);

  // Handle TTS preference change
  const handleTTSPreferenceChange = (preference: 'browser' | 'elevenlabs') => {
    setTtsPreference(preference);
    setTTSPreference(preference);
    toast({
      title: "Preferencia actualizada",
      description: `Ahora usando ${preference === 'browser' ? 'síntesis de voz del navegador' : 'ElevenLabs API'}`,
      variant: "default",
    });
    window.location.reload();
  };

  useEffect(() => {
    const validateParams = async () => {
      // Check for existing session cookie first
      const existingSession = Cookies.get(SESSION_COOKIE_NAME);
      if (existingSession) {
        try {
          const sessionData = JSON.parse(existingSession);
          setElderId(sessionData.userId);
          setIsValid(true);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error("Error parsing session cookie:", err);
          Cookies.remove(SESSION_COOKIE_NAME);
        }
      }

      // if(!(currentEnvironment === "prod")) {
      if (currentEnvironment === "prod") {
        const token = searchParams.get("token");
        const userId = searchParams.get("userId");

        if (!token || !userId) {
          setError("Token y userId son requeridos");
          setIsLoading(false);
          return;
        }

        try {
          // Consultar el token en la base de datos
          const { data: tokenData, error: tokenError } = await supabase
            .from("token_logs")
            .select("*")
            .eq("generated_token", token)
            .eq("elder_id", userId)
            .eq("is_active", true)
            .single();

          console.log(tokenData, tokenError);

          if (tokenError) {
            throw new Error("Error al validar el token");
          }

          if (!tokenData) {
            setError("Token inválido o expirado");
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

          // Store session information in cookie
          const sessionData = {
            userId,
            token,
            timestamp: new Date().toISOString(),
          };
          Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
            expires: SESSION_EXPIRY_DAYS,
            secure: true,
            sameSite: "strict",
          });

          toast({
            title: "Acceso validado",
            description: "Token validado correctamente",
            variant: "default",
          });

          setIsValid(true);
          setElderId(userId);
          console.log("Inicio de sesión correcto");
        } catch (err) {
          setError("Error en la validación");
          console.error("Error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setIsValid(true);
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

        <div className="flex flex-col items-center justify-center w-full max-w-xl space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-2 text-gradient-blue mt-10">
              ¡Hola! ¿Cómo puedo
              <br />
              ayudarte hoy?
            </h1>
            <p className="text-lg text-blue-300 mt-3">
              Soy tu asistente de IA, listo para conversar
            </p>
          </div>

          {/* {(currentEnvironment === "prod") && ( */}
          {!(currentEnvironment === "prod") && (
            <Accordion type="single" collapsible className="w-full mb-4">
              <AccordionItem value="config" className="border-none">
                <AccordionTrigger className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <Settings className="h-4 w-4" />
                  Configuración del Entorno
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full space-y-4">
                    <div>
                      <label
                        htmlFor="elderId"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        ID del Adulto Mayor
                      </label>
                      <input
                        type="text"
                        id="elderId"
                        value={elderId}
                        onChange={(e) => setElderId(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese el ID del adulto mayor"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="webhookUrl"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        URL del Webhook N8N (opcional)
                      </label>
                      <input
                        type="text"
                        id="webhookUrl"
                        value={customWebhookUrl}
                        onChange={(e) => setCustomWebhookUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="URL personalizada del webhook N8N"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Motor de Texto a Voz
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleTTSPreferenceChange('browser')}
                          className={`px-4 py-2 rounded-md ${
                            ttsPreference === 'browser'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Navegador
                        </button>
                        <button
                          onClick={() => handleTTSPreferenceChange('elevenlabs')}
                          className={`px-4 py-2 rounded-md ${
                            ttsPreference === 'elevenlabs'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          ElevenLabs API
                        </button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <VoiceAssistant
            apiKey={apiKey}
            className="w-full"
            elderId={elderId}
            webhookUrl={customWebhookUrl || endpoints.n8n.webhook}
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
