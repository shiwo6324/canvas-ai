import React from 'react';
import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import ShapeTool from './shape-tool';
import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface StrokeWidthSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const widthValue = editor?.getActiveObjectStrokeWidth() || STROKE_WIDTH;
  const typeValue =
    editor?.getActiveObjectStrokeDashArray() || STROKE_DASH_ARRAY;
  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStorkeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'stroke-width' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="边框选项" description="添加边框宽度" />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Label className="text-sm">边框宽度</Label>
          <Slider
            value={[widthValue]}
            onValueChange={([value]) => onChangeStrokeWidth(value)}
          />
        </div>
        <div className=" p-4 space-y-4 border-b">
          <Label className="text-sm">边框样式</Label>
          <div className="flex items-center gap-2 flex-col">
            <Button
              variant="secondary"
              size="lg"
              className={cn(
                'w-full h-16 justify-start text-left py-4 px-8',
                typeValue.length === 0 && 'border-2 border-blue-500'
              )}
              onClick={() => onChangeStorkeType([])}
            >
              <div className="w-full border-black rounded-full border-4 " />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className={cn(
                'w-full h-16 justify-start text-left py-4 px-8',
                typeValue.length === 2 && 'border-2 border-blue-500'
              )}
              onClick={() => onChangeStorkeType([5, 5])}
            >
              <div className="w-full border-black rounded-full border-4 border-dashed" />
            </Button>
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default StrokeWidthSidebar;
