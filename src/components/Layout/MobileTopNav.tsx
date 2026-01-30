import { Settings } from 'lucide-react';
import { Button } from '../ui';

export function MobileTopNav() {
  return (
    <nav className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xl shadow-primary-500/20">
          SN
        </div>
        <span className="text-xl font-bold tracking-tight text-white">StockNote</span>
      </div>
      <Button 
        variant="secondary"
        size="sm"
        className="w-10 h-10 p-0 rounded-xl"
      >
        <Settings size={20} className="text-gray-400" />
      </Button>
    </nav>
  );
}
