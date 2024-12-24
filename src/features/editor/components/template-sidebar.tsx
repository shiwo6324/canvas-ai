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
import { Button } from '@/components/ui/button';
import { useGetImages } from '@/features/images/api/use-get-images';
import { AlertTriangle, ExternalLink, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadButton } from '@/lib/uploadthing';
import {
  Template,
  useGetTemplates,
} from '@/features/projects/api/use-get-templates';
import ImageSidebar from './image-sidebar';

interface TemplateSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const { data, isLoading, isError } = useGetTemplates({
    limit: '20',
    page: '1',
  });

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onClick = async (template: Template['data'][0]) => {
    editor?.importJson(template.json);
  };

  return (
    <aside
      className={cn(
        ' relative border-r z-[40] w-[360px] flex h-full flex-col  bg-white ',
        activeTool === 'templates' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="模板" description="选择模板" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center  ">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col gap-y-4 items-center justify-center   ">
          <AlertTriangle className="size-4 text-muted-foreground " />
          <p className="text-sm text-muted-foreground">
            获取模板失败，请稍后再试
          </p>
        </div>
      )}
      <ScrollArea className="flex-1 w-full">
        {' '}
        {/* 使用 flex-1 来填充剩余空间 */}
        <div className="p-4 ">
          <div className="space-y-1  h-full grid grid-cols-2 gap-4 ">
            {data &&
              data.map((template) => {
                return (
                  <button
                    style={{
                      aspectRatio: `${template.width}/${template.height}`,
                    }}
                    className="relative w-full  
                  group hover:opacity-75 transition bg-muted 
                  rounded-sm overflow-hidden border"
                    key={template.id}
                    onClick={() => onClick(template)}
                  >
                    <Image
                      fill
                      src={template.thumbnailUrl || ''}
                      alt={template.name || '模板'}
                      className="object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/50">
                      <div className="absolute top-1 right-1 text-white hover:text-white/80">
                        {template.name}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default TemplateSidebar;
