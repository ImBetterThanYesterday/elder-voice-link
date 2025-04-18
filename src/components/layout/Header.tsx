import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const SESSION_COOKIE_NAME = 'user_session';

export const Header = () => {
  const { toast } = useToast();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const session = Cookies.get(SESSION_COOKIE_NAME);
    setHasSession(!!session);
  }, []);

  const handleLogout = () => {
    Cookies.remove(SESSION_COOKIE_NAME);
    window.location.reload();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
      variant: "default",
    });
  };

  return (
    <header className="bg-black/70 backdrop-blur-md py-4 absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-elder-lg font-bold text-gradient bg-gradient-to-r from-lime-400 to-teal-300 bg-clip-text text-transparent">Elder Voice Link</span>
        </Link>
        {hasSession && (
          <>
            {/* Mobile: solo icono */}
            <button
              onClick={handleLogout}
              className="block md:hidden p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              aria-label="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
            {/* Desktop: texto */}
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
};
