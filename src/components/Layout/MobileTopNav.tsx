import { Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui';

export function MobileTopNav() {
  const navigate = useNavigate();

  return (
    <nav className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xl shadow-primary-500/20">
          SN
        </div>
        <span className="text-xl font-bold tracking-tight text-white">StockNote</span>
      </Link>
      
      <Button 
        variant="secondary"
        size="sm"
        className="w-10 h-10 p-0 rounded-xl active:scale-90 transition-transform"
        onClick={() => navigate('/settings')}
      >
        <Settings size={20} className="text-gray-400" />
      </Button>
    </nav>
  );
}
