'use client';
import React from 'react';
import Logo from './logo';
import { CiFileOn } from 'react-icons/ci';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Download,
  MousePointer,
  MousePointerClick,
  Redo2,
  Undo2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Hint from '@/components/hint';
import { BsCloudCheck } from 'react-icons/bs';
import { ActiveTool, Editor } from '../types';
import { cn } from '@/lib/utils';
import { useFilePicker } from 'use-file-picker';
import UserButton from '@/features/auth/components/user-button';

interface NavbarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  editor: Editor | undefined;
}

const Navbar = ({ activeTool, onChangeActiveTool, editor }: NavbarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: '.json',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = (e) => {
          const content = e.target?.result;
          editor?.importJson(content as string);
        };
      }
    },
  });

  return (
    <div
      className="w-full flex items-center p-4 h-[68px] gap-x-8
  border-b lg:pl-[34px] 
  "
    >
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              文件
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={openFilePicker}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>打开</p>
                <p className="text-xs text-muted-foreground">打开 JSON 文件</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />

        <Hint label="选择" side="bottom" sideOffset={10}>
          <Button
            size="icon"
            variant="ghost"
            className={cn(activeTool === 'select' && 'bg-gray-100')}
            onClick={() => onChangeActiveTool('select')}
          >
            <MousePointerClick className="size-4  " />
          </Button>
        </Hint>

        <Hint label="撤销" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canUndo()}
            onClick={() => editor?.onUndo()}
            size="icon"
            variant="ghost"
          >
            <Undo2 className="size-4  " />
          </Button>
        </Hint>

        <Hint label="重做" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canRedo()}
            size="icon"
            variant="ghost"
            onClick={() => editor?.onRedo()}
          >
            <Redo2 className="size-4  " />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="size-[20px] text-muted-foreground" />
          <p className="text-sm text-muted-foreground">已保存</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              导出
              <Download className="size-4 ml-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveJson()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">
                  保存稍后重新编辑
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.savePng()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">
                  适用于在Web上分享
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveJpg()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>JPG</p>
                <p className="text-xs text-muted-foreground">
                  适用于在打印时使用
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveSvg()}
            >
              <CiFileOn className="size-8" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">
                  适用于在设计软件中编辑
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
