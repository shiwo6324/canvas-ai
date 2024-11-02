import React, { useState } from 'react';
import { ActiveTool, Editor } from '../types';
import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BsBorderWidth } from 'react-icons/bs';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { RxTransparencyGrid } from 'react-icons/rx';
import { isTextType } from '../utils';

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  key: string;
}

const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
  key,
}: ToolbarProps) => {
  // const selectedObject = editor?.canvas.getActiveObject();
  // 获取当前选中对象的填充颜色
  const fillColor = editor?.getActiveObjectFillColor();
  // 获取当前选中对象的边框颜色
  const strokeColor = editor?.getActiveObjectStrokeColor();

  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isSelectedObjectText = isTextType(selectedObjectType);

  // 如果没有选中任何对象，则返回一个空的工具栏
  if (editor?.selectedObjects.length === 0) {
    return (
      <div
        className="shrink-0 h-[56px] border-b bg-white
    w-full flex overflow-x-auto items-center z-[49] p-2 gap-x-2"
      />
    );
  }

  return (
    <div
      className="shrink-0 h-[56px] border-b bg-white
    w-full flex overflow-x-auto items-center z-[49] p-2 gap-x-2"
    >
      <div className="flex items-center h-full justify-center">
        <Hint label="color " side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool('fill')}
            size="icon"
            variant="ghost"
            className={cn(activeTool === 'fill' && 'bg-gray-100')}
          >
            <div
              className="rounded-sm size-4 border"
              style={{
                backgroundColor: fillColor,
              }}
            ></div>
          </Button>
        </Hint>
        {!isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="边框颜色 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool('stroke-color')}
                size="icon"
                variant="ghost"
                className={cn(activeTool === 'stroke-color' && 'bg-gray-100')}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{
                    borderColor: strokeColor,
                  }}
                ></div>
              </Button>
            </Hint>
          </div>
        )}

        {!isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="边框宽度 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool('stroke-width')}
                size="icon"
                variant="ghost"
                className={cn(activeTool === 'stroke-width' && 'bg-gray-100')}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        <div className="flex items-center h-full justify-center">
          <Hint label="上移 " side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.bringForward()}
              size="icon"
              variant="ghost"
            >
              <ArrowUp className="size-4" />
            </Button>
          </Hint>
        </div>

        <div className="flex items-center h-full justify-center">
          <Hint label="下移 " side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.sendBackwards()}
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="size-4" />
            </Button>
          </Hint>
        </div>

        <div className="flex items-center h-full justify-center">
          <Hint label="透明度 " side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('opacity')}
              size="icon"
              variant="ghost"
              className={cn(activeTool === 'opacity' && 'bg-gray-100')}
            >
              <RxTransparencyGrid className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
