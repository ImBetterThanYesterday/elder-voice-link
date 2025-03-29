
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-elder-2xl font-bold text-elder-dark">Elder Voice Link</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-elder-lg font-medium text-elder-dark hover:text-elder-primary transition">
            Home
          </Link>
          <Link to="/family" className="text-elder-lg font-medium text-elder-dark hover:text-elder-primary transition">
            Family Portal
          </Link>
          <Link to="/about" className="text-elder-lg font-medium text-elder-dark hover:text-elder-primary transition">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};
