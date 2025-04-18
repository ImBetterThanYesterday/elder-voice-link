import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Extender la interfaz Window para incluir nuestra propiedad personalizada
declare global {
  interface Window {
    clearAppCache?: () => void;
  }
}

const CacheClearer: React.FC = () => {
  const { toast } = useToast();

  const handleClearCache = () => {
    // Verificar si la función global está disponible
    if (typeof window !== 'undefined' && window.clearAppCache) {
      window.clearAppCache();
      toast({
        title: "Limpiando caché",
        description: "La aplicación se recargará para aplicar los cambios.",
      });
    } else {
      // Método alternativo si la función global no está disponible
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }).then(() => {
          toast({
            title: "Caché limpiado",
            description: "La aplicación se recargará para aplicar los cambios.",
          });
          // Recargar la página después de un breve retraso
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      } else {
        toast({
          title: "No se pudo limpiar el caché",
          description: "Su navegador no soporta esta funcionalidad.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={handleClearCache}
      className="text-xs"
    >
      Limpiar caché
    </Button>
  );
};

export default CacheClearer; 