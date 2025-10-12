import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Home, 
  Database, 
  ShoppingCart,
  Package,
  Wallet,
  TrendingUp,
  Printer,
  Download,
  Settings as SettingsIcon, // Import Settings icon
  Menu,
  X // Import X icon for close button
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportData } from '@/components/ExportData';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate
  const { theme } = useTheme();
  const { user, logout } = useAuth(); // Get logout from AuthContext

  // Theme-aware classes
  const themeClasses = {
    sidebar: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    sidebarHeader: theme === 'dark' 
      ? 'border-gray-700 text-indigo-400' 
      : 'border-gray-200 text-indigo-600',
    sidebarCloseButton: theme === 'dark' 
      ? 'text-gray-300 hover:text-white' 
      : 'text-gray-600 hover:text-gray-900',
    navItemActive: theme === 'dark' 
      ? 'bg-indigo-600 text-white' 
      : 'bg-indigo-100 text-indigo-700',
    navItemInactive: theme === 'dark' 
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    userPanel: theme === 'dark' 
      ? 'border-gray-700 text-gray-400' 
      : 'border-gray-200 text-gray-700',
    topNav: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    topNavButton: theme === 'dark' 
      ? 'text-gray-400 hover:text-white' 
      : 'text-gray-600 hover:text-gray-900',
    topNavMenu: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-900',
    topNavMenuItem: theme === 'dark' 
      ? 'text-white hover:bg-gray-700' 
      : 'text-gray-700 hover:bg-gray-100',
    mainContent: theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100',
    pageTitle: theme === 'dark' 
      ? 'text-white' 
      : 'text-gray-900',
    userDropdownLabel: theme === 'dark' 
      ? 'text-white' 
      : 'text-gray-900',
    userDropdownText: theme === 'dark' 
      ? 'text-gray-300' 
      : 'text-gray-700',
    sidebarButton: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Inventory', href: '/inventory', icon: Database },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
    { name: 'Expenses', href: '/expenses', icon: TrendingUp },
    { name: 'Cashflow', href: '/cashflow', icon: Wallet },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
    // Test route - only show in development
    ...(import.meta.env.MODE === 'development' ? [{ name: 'Inventory Test', href: '/inventory-test', icon: Database }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={theme === 'dark' ? "flex h-screen bg-gray-900" : "flex h-screen bg-gray-50"}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          themeClasses.sidebarButton
        } ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex items-center justify-between h-16 px-4 border-b ${themeClasses.sidebarHeader}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl">POS System</div>
          </div>
          <button
            className={`lg:hidden ${themeClasses.sidebarCloseButton}`}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? themeClasses.navItemActive
                      : themeClasses.navItemInactive
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className={`absolute bottom-0 w-full p-4 border-t ${themeClasses.userPanel}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <div className="ml-3">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs capitalize">{user?.role || 'user'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top navigation */}
        <div className={`relative z-10 flex flex-shrink-0 h-16 border-b ${themeClasses.topNav}`}>
          <button
            className={`px-4 border-r focus:outline-none lg:hidden ${themeClasses.topNavButton}`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-between flex-1 px-4">
            <div className="flex items-center">
              <h1 className={`text-xl font-semibold truncate ${themeClasses.pageTitle}`}>
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <ExportData />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className={theme === 'dark' 
                  ? "hidden sm:flex items-center bg-gray-700 text-white border-gray-600 hover:bg-gray-600" 
                  : "hidden sm:flex items-center bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}
              >
                <Printer className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Print</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 ${themeClasses.topNavMenu}`} align="end" forceMount>
                  <DropdownMenuLabel className={`font-normal ${themeClasses.userDropdownLabel}`}>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className={`text-xs leading-none ${themeClasses.userDropdownText}`}>
                        {user?.email || 'user@example.com'}
                      </p>
                      <p className={`text-xs leading-none capitalize ${themeClasses.userDropdownText}`}>
                        {user?.role || 'user'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === 'dark' ? "bg-gray-700" : "bg-gray-200"} />
                  <DropdownMenuItem 
                    className={themeClasses.topNavMenuItem} 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className={`flex-1 overflow-y-auto ${themeClasses.mainContent} p-4 md:p-6`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}