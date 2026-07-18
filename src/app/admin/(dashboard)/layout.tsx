'use client'

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-darker flex">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Header */}
        <header className="lg:hidden h-20 bg-surface-dark border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)]">
          <span className="text-lg font-bold font-display text-white">Admin Panel</span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 text-text-secondary hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
