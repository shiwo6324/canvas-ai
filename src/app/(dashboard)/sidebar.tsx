import sidebar from '@/features/editor/components/sidebar';
import React from 'react';
import SidebarRoutes from './sidebar-routes';
import Logo from './logo';

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
      <Logo />
      <SidebarRoutes />
    </aside>
  );
};

export default Sidebar;
