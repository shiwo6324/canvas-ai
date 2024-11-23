import React from 'react';
import { ActiveTool, Editor, FILL_COLOR, STROKE_COLOR } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ColorPicker from './color-picker';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface DrawSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const DrawSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const colorValue = editor?.getActiveObjectStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveObjectStrokeWidth() || 1;

  const onClose = () => {
    editor?.disableDraw();
    onChangeActiveTool('select');
  };

  const onColorChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  const onWidthChange = (value: number[]) => {
    editor?.changeStrokeWidth(value[0]);
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'draw' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="画笔" description="修改画笔的属性" />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Label className="text-sm">画笔宽度</Label>
          <Slider value={[widthValue]} onValueChange={onWidthChange} />
        </div>

        <div className=" p-4 space-y-4">
          <ColorPicker value={colorValue} onChange={onColorChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default DrawSidebar;
