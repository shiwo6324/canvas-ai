import React, { useEffect, useMemo, useState } from 'react';
import { ActiveTool, Editor, FILL_COLOR } from '../types';
import { cn } from '@/lib/utils';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import ColorPicker from './color-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsSidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initalWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initalHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initalBackground = useMemo(
    () => workspace?.fill ?? '#ffffff',
    [workspace]
  );

  const [width, setWidth] = useState(initalWidth);
  const [height, setHeight] = useState(initalHeight);
  const [background, setBackground] = useState(initalBackground);

  useEffect(() => {
    setWidth(initalWidth);
    setHeight(initalHeight);
    setBackground(initalBackground);
  }, [initalWidth, initalHeight, initalBackground]);

  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] flex h-full flex-col',
        activeTool === 'settings' ? ' visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="设置" description="调整画布" />
      <ScrollArea>
        <form className="p-4 space-y-4" onSubmit={onSubmit}>
          <div className="  space-y-2">
            <Label>宽度</Label>
            <Input
              type="number"
              placeholder="宽度"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          <div className="  space-y-2">
            <Label>高度</Label>
            <Input
              type="number"
              placeholder="高度"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit">
            调整大小
          </Button>
        </form>
        <div className="p-4">
          <ColorPicker
            value={background as string}
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default SettingsSidebar;
