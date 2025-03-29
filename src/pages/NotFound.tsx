
import { MainLayout } from "@/components/layout/MainLayout";
import { ElderButton } from "@/components/ui/elder-button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-elder-2xl font-bold text-elder-dark mb-6">Page Not Found</h1>
        <p className="text-elder-xl text-elder-text mb-8">
          We can't seem to find the page you're looking for.
        </p>
        <Link to="/">
          <ElderButton size="lg">
            Return to Home
          </ElderButton>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
