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

interface ImageSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const { data, isLoading, isError } = useGetImages();
  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        ' relative border-r z-[40] w-[360px] flex h-full flex-col  bg-white ',
        activeTool === 'images' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="图片" description="添加图片到画布中" />

      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: 'w-full text-sm font-medium ',
            allowedContent: 'hidden',
          }}
          content={{
            button: '上传图片',
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
          }}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center  ">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col gap-y-4 items-center justify-center   ">
          <AlertTriangle className="size-4 text-muted-foreground " />
          <p className="text-sm text-muted-foreground">
            获取图片失败，请稍后再试
          </p>
        </div>
      )}
      <ScrollArea className="flex-1 w-full">
        {' '}
        {/* 使用 flex-1 来填充剩余空间 */}
        <div className="p-4 ">
          <div className="space-y-1  h-full grid grid-cols-2 gap-4 ">
            {data &&
              data.map((image) => {
                return (
                  <button
                    className="relative w-full h-[100px] 
                  group hover:opacity-75 transition bg-muted 
                  rounded-sm overflow-hidden border"
                    key={image.id}
                    onClick={() => {
                      editor?.addImage(image.urls.regular);
                    }}
                  >
                    <Image
                      fill
                      src={image.urls.small}
                      alt={image.description || '图片'}
                      className="object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-black/50">
                      <Link
                        href={image.links.html}
                        target="_blank"
                        className="absolute top-1 right-1 text-white hover:text-white/80"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
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

export default ImageSidebar;
