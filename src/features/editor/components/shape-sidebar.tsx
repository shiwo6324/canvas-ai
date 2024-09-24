import React from 'react';
import { ActiveTool } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import ShapeTool from './shape-tool';
import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { IoTriangle } from 'react-icons/io5';
import { FaDiamond } from 'react-icons/fa6';

interface ShapeSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'shapes' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="形状" description="添加形状到画布中" />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool onClick={() => {}} icon={FaCircle} />
          <ShapeTool onClick={() => {}} icon={FaSquare} />
          <ShapeTool onClick={() => {}} icon={FaSquareFull} />
          <ShapeTool
            onClick={() => {}}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => {}} icon={FaDiamond} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool('select')} />
    </aside>
  );
};

export default ShapeSidebar;
