import React, { useEffect, useMemo, useState } from 'react';
import { ActiveTool, Editor, STROKE_DASH_ARRAY, STROKE_WIDTH } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';

interface TextSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'text' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="文本" description="调整文本" />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Button className="w-full" onClick={() => editor?.addText('文本')}>
            添加文本
          </Button>

          <Button
            className="w-full h-14"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText('标题', {
                fontSize: 100,
                fontWeight: 700,
              })
            }
          >
            <span className="text-3xl font-bold">添加标题</span>
          </Button>

          <Button
            className="w-full h-14"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText('副标题', {
                fontSize: 50,
                fontWeight: 500,
              })
            }
          >
            <span className="text-2xl font-semibold">添加副标题</span>
          </Button>

          <Button
            className="w-full h-14"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText('正文', {
                fontSize: 40,
                fontWeight: 400,
              })
            }
          >
            添加正文
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default TextSidebar;
