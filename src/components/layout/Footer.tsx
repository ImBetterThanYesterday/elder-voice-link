export const Footer = () => {
  return (
    <footer className="bg-black/80 text-gray-400 py-4 text-center text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          <p className="mt-2 md:mt-0 w-[200px]">
            <a href="mailto:support@elderlink.life" className="hover:text-white transition-colors">
              support@elderlink.life
            </a>
          </p>
          <p className="mt-1 md:mt-0 text-xs w-[200px]">Version 1.1.0</p>
          <p className="w-[200px]">© {new Date().getFullYear()} Elder Voice Link</p>
        </div>
      </div>
    </footer>
  );
};
