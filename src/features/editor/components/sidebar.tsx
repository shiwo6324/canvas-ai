'use client';
import React from 'react';
import { SidebarItem } from './sidebar-item';
import {
  ImageIcon,
  LayoutTemplate,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react';
import { ActiveTool } from '../types';

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="w-[100px] bg-white border-r h-full flex flex-col overflow-y-auto">
      <ul className="flex flex-col">
        <SidebarItem
          icon={LayoutTemplate}
          label="设计"
          isActive={activeTool === 'templates'}
          onClick={() => onChangeActiveTool('templates')}
        />
        <SidebarItem
          icon={ImageIcon}
          label="图片"
          isActive={activeTool === 'images'}
          onClick={() => onChangeActiveTool('images')}
        />
        <SidebarItem
          icon={Type}
          label="文本"
          isActive={activeTool === 'text'}
          onClick={() => onChangeActiveTool('text')}
        />
        <SidebarItem
          icon={Shapes}
          label="图形"
          isActive={activeTool === 'shapes'}
          onClick={() => onChangeActiveTool('shapes')}
        />
        <SidebarItem
          icon={Sparkles}
          label="AI"
          isActive={activeTool === 'ai'}
          onClick={() => onChangeActiveTool('ai')}
        />
        <SidebarItem
          icon={Settings}
          label="设置"
          isActive={activeTool === 'settings'}
          onClick={() => onChangeActiveTool('settings')}
        />
      </ul>
    </aside>
  );
};

export default Sidebar;
