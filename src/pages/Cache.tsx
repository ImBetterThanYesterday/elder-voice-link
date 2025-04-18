import { MainLayout } from "@/components/layout/MainLayout";
import CacheClearer from "@/components/CacheClearer";

const Cache = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mt-8 mx-auto mt-[6rem] bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-elder-dark">Limpiar Caché</h1>
        <p className="mb-6 text-elder-text">
          Puedes limpiar el caché de la aplicación para solucionar problemas de almacenamiento o actualizar recursos guardados.
        </p>
        <CacheClearer />
      </div>
    </MainLayout>
  );
};

export default Cache;
