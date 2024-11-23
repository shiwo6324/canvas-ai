import React, { useState } from 'react';
import { ActiveTool, Editor, FILL_COLOR } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateImage } from '@/features/ai/api/use-generate-image';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useRemoveBackground } from '@/features/ai/api/use-remove-background';

interface RemoveBgSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  const [value, setValue] = useState('');
  const selectedObject = editor?.selectedObjects[0];
  // @ts-ignore
  const imageSrc = selectedObject?._originalElement?.currentSrc;
  const mutation = useRemoveBackground();

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onClick = () => {
    mutation.mutate(
      { image: imageSrc },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data);
        },
      }
    );
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'remove-bg' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="背景移除" description="使用 AI 移除背景" />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">该功能需要先选择图片</p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                'relative aspect-square rounded-md overflow-hidden transition bg-muted',
                mutation.isPending && 'opacity-50'
              )}
            >
              <Image src={imageSrc} alt="图片" fill className="object-cover" />
            </div>
            <Button
              className="w-full"
              onClick={onClick}
              disabled={mutation.isPending}
            >
              移除背景
            </Button>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default RemoveBgSidebar;
