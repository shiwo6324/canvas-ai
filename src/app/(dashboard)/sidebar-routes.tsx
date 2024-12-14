'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Crown,
  Home,
  MessageCircle,
  MessageCircleQuestion,
} from 'lucide-react';
import React from 'react';
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const SidebarRoutes = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Button
          className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
          variant="outline"
          size="lg"
        >
          <Crown className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
          升级
        </Button>
      </div>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          icon={Home}
          label="首页"
          isActive={pathname === '/'}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          icon={CreditCard}
          label="账单"
          onClick={() => {}}
        />

        <SidebarItem
          href={pathname}
          icon={MessageCircleQuestion}
          label="帮助"
          onClick={() => {}}
        />
      </ul>
    </div>
  );
};

export default SidebarRoutes;
