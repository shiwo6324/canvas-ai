import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveTool,
  Editor,
  filters,
  fonts,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col  ',
        activeTool === 'filter' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="滤镜" description="应用滤镜" />
      <ScrollArea className="h-full overflow-y-scroll">
        <div className=" p-4 space-y-1 border-b h-full  ">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="secondary"
              size="lg"
              className={cn('w-full h-16 justify-start text-left')}
              onClick={() => editor?.changeImageFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default FilterSidebar;
