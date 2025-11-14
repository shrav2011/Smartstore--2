
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ScanLine, Upload, Download, Settings, GitFork } from 'lucide-react';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/products', icon: Package, text: 'Products' },
    { to: '/add-product', icon: PlusCircle, text: 'Add Product' },
    { to: '/scan', icon: ScanLine, text: 'Barcode Scan' },
    { to: '/backup-restore', icon: Upload, text: 'Backup & Restore' },
    { to: '/settings', icon: Settings, text: 'Settings' },
  ];
  
  const baseLinkClass = "flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-primary-500 text-white dark:bg-primary-600";

  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
        <GitFork className="h-8 w-8 text-primary-600" />
        <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">SmartStock</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeSidebar}
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 mt-auto border-t dark:border-gray-700">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          SmartStock by Shravan
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
