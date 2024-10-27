import React from 'react';
import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import ShapeTool from './shape-tool';
import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { IoTriangle } from 'react-icons/io5';
import { FaDiamond } from 'react-icons/fa6';
import ColorPicker from './color-picker';

interface StrokeColorSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const StrokeColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeColorSidebarProps) => {
  const value = editor?.getActiveObjectStrokeColor() || STROKE_COLOR;

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'stroke-color' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="填充边框颜色" description="添加边框颜色" />
      <ScrollArea>
        <div className=" p-4 space-y-4">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default StrokeColorSidebar;
