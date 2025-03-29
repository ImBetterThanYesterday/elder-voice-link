
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-black/70 backdrop-blur-md py-4 absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-elder-lg font-bold text-gradient bg-gradient-to-r from-lime-400 to-teal-300 bg-clip-text text-transparent">Elder Voice Link</span>
        </Link>
      </div>
    </header>
  );
};
