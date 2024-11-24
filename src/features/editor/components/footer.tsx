import { Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import { Editor } from '../types';

const Footer = ({ editor }: { editor: Editor | undefined }) => {
  return (
    <div
      className="h-[52px] border-t bg-white
    w-full flex items-center overflow-x-auto gap-x-1 shrink-0 z-[49] p-2 px-4 flex-row-reverse"
    >
      <Hint label="重置" side="top" sideOffset={10}>
        <Button
          className="h-full"
          variant="ghost"
          size="icon"
          onClick={editor?.autoZoom}
        >
          <Minimize className="size-4" />
        </Button>
      </Hint>
      <Hint label="放大" side="top" sideOffset={10}>
        <Button
          className="h-full"
          variant="ghost"
          size="icon"
          onClick={editor?.zoomIn}
        >
          <ZoomIn className="size-4" />
        </Button>
      </Hint>

      <Hint label="缩小" side="top" sideOffset={10}>
        <Button
          className="h-full"
          variant="ghost"
          size="icon"
          onClick={editor?.zoomOut}
        >
          <ZoomOut className="size-4" />
        </Button>
      </Hint>
    </div>
  );
};

export default Footer;
