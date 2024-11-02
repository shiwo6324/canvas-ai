import React, { useEffect, useMemo, useState } from 'react';
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

interface OpacitySidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: OpacitySidebarProps) => {
  const initalValue = editor?.getActiveObjectOpacity() || 1;
  const [opacityValue, setOpacityValue] = useState(initalValue);

  const selectedObject = useMemo<fabric.Object | null>(() => {
    return editor?.selectedObjects[0] || null;
  }, [editor?.selectedObjects]);

  useEffect(() => {
    setOpacityValue(selectedObject?.get('opacity') || 1);
  }, [selectedObject]);

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onChangeOpacity = (value: number) => {
    editor?.changeOpacity(value);
    setOpacityValue(value);
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'opacity' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="透明度" description="调整透明度" />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Label className="text-sm">透明度</Label>
          <Slider
            value={[opacityValue]}
            onValueChange={([value]) => onChangeOpacity(value)}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default OpacitySidebar;
