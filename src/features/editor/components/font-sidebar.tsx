import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveTool,
  Editor,
  fonts,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';

interface FontSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col  ',
        activeTool === 'font' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="字体" description="调整字体" />
      <ScrollArea className="h-full overflow-y-scroll">
        <div className=" p-4 space-y-1 border-b h-full  ">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="lg"
              className={cn(
                'w-full h-16 justify-start text-left',
                editor?.getActiveObjectFontFamily() === font &&
                  'border-2 border-blue-500'
              )}
              style={{
                fontFamily: font,
                fontSize: '16px',
                padding: '8px 16px',
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default FontSidebar;
