
import React from 'react';
import { Bell, Search, User, Menu, Globe, Shield } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-80">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="البحث في الخدمات، السجلات، أو الموارد..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full px-2 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          السيادة: مشفرة وآمنة
        </div>
        
        <div className="flex items-center gap-1 border-r border-l border-gray-200 px-4 mx-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Globe size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Shield size={20} />
            </button>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-left hidden lg:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">مدير النظام</p>
            <p className="text-xs text-gray-500">root@yemenjpt.local</p>
          </div>
          <div className="w-9 h-9 bg-yemenBlue text-white rounded-full flex items-center justify-center font-bold">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
