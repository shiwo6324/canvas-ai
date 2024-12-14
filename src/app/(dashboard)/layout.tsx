import React from 'react';
import Sidebar from './sidebar';
import { Navbar } from './navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted h-full">
      <Sidebar />
      <div className="lg:pl-[300px] flex flex-col h-full">
        <Navbar />
        <main className="flex-1 bg-white overflow-auto p-8 lg:rounded-tl-2xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
