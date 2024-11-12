import React, { useState } from 'react';
import { ActiveTool, Editor, FONT_SIZE, FONT_WEIGHT } from '../types';
import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BsBorderWidth } from 'react-icons/bs';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Trash,
} from 'lucide-react';
import { RxTransparencyGrid } from 'react-icons/rx';
import { isTextType } from '../utils';
import {
  FaAlignLeft,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
} from 'react-icons/fa';
import FontSizeInput from './font-size-input';

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
  const initialFillColor = editor?.getActiveObjectFillColor();
  // 获取当前选中对象的边框颜色
  const initialStrokeColor = editor?.getActiveObjectStrokeColor();

  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isSelectedObjectText = isTextType(selectedObjectType);

  const initialFontFamily = editor?.getActiveObjectFontFamily();
  const initialFontStyle = editor?.getActiveObjectFontStyle();
  const initialFontLinethrough = editor?.getActiveObjectFontLineThrough();
  const initialFontUnderline = editor?.getActiveObjectFontUnderline();
  const initialTextAlign = editor?.getActiveObjectTextAlign();
  const initialFontSize = editor?.getActiveObjectFontSize();

  // fontWEight 的改变没有触发渲染，所以需要单独处理
  const initialFontWeight = editor?.getActiveObjectFontWeight() || FONT_WEIGHT;
  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontWeight: initialFontWeight,
    fontFamily: initialFontFamily,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
  });

  // 如果没有选中任何对象，则返回一个空的工具栏
  if (editor?.selectedObjects.length === 0) {
    return (
      <div
        className="shrink-0 h-[56px] border-b bg-white
    w-full flex overflow-x-auto items-center z-[49] p-2 gap-x-2"
      />
    );
  }

  const changeTextAlign = (value: string) => {
    if (!isSelectedObjectText) return;
    editor?.changeTextAlign(value);
    setProperties({
      ...properties,
      textAlign: value,
    });
  };

  const changeFontSize = (value: number) => {
    if (!isSelectedObjectText) return;
    editor?.changeFontSize(value);
    setProperties({
      ...properties,
      fontSize: value,
    });
  };
  return (
    <div
      className="shrink-0 h-[56px] border-b bg-white
    w-full flex overflow-x-auto items-center z-[49] p-2 gap-x-2"
    >
      <div className="flex items-center h-full justify-center gap-2">
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
                backgroundColor: properties.fillColor,
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
                    borderColor: properties.strokeColor,
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

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="字体 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => onChangeActiveTool('font')}
                size="icon"
                variant="ghost"
                className={cn(
                  'w-auto px-2 text-sm',
                  activeTool === 'font' && 'bg-gray-100'
                )}
              >
                <div className="max-w-[100px] truncate">
                  {properties.fontFamily}
                </div>
                <ChevronDown className="size-4 ml-2 shrink-0" />
              </Button>
            </Hint>
          </div>
        )}
        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="加粗 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => {
                  const selectedObject = editor?.selectedObjects[0];
                  if (selectedObject) {
                    const newFontWeight =
                      properties.fontWeight > 500 ? FONT_WEIGHT : 700;
                    editor?.changeFontWeight(newFontWeight);
                    setProperties({
                      ...properties,
                      fontWeight: newFontWeight,
                    });
                  }
                }}
                size="icon"
                variant="ghost"
                className={cn(properties.fontWeight > 500 && 'bg-gray-100')}
              >
                <FaBold className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="斜体 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => {
                  const selectedObject = editor?.selectedObjects[0];
                  if (selectedObject) {
                    const newFontStyle =
                      properties.fontStyle === 'italic' ? 'normal' : 'italic';
                    editor?.changeFontStyle(newFontStyle);
                    setProperties({
                      ...properties,
                      fontStyle: newFontStyle,
                    });
                  }
                }}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontStyle === 'italic' && 'bg-gray-100'
                )}
              >
                <FaItalic className="size-4" />
              </Button>
            </Hint>
          </div>
        )}
        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="删除线 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => {
                  const newValue = properties.fontLinethrough ? false : true;
                  editor?.changeFontLineThrough(newValue);
                  setProperties({
                    ...properties,
                    fontLinethrough: newValue,
                  });
                }}
                size="icon"
                variant="ghost"
                className={cn(properties.fontLinethrough && 'bg-gray-100')}
              >
                <FaStrikethrough className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="下划线 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => {
                  editor?.changeFontUnderline(!properties.fontUnderline);
                  setProperties({
                    ...properties,
                    fontUnderline: !properties.fontUnderline,
                  });
                }}
                size="icon"
                variant="ghost"
                className={cn(properties.fontUnderline && 'bg-gray-100')}
              >
                <FaUnderline className="size-4" />
              </Button>
            </Hint>
          </div>
        )}
        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="居左 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => changeTextAlign('left')}
                size="icon"
                variant="ghost"
                className={cn(properties.textAlign === 'left' && 'bg-gray-100')}
              >
                <AlignLeft className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="居中 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => changeTextAlign('center')}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === 'center' && 'bg-gray-100'
                )}
              >
                <AlignCenter className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="居右 " side="bottom" sideOffset={5}>
              <Button
                onClick={() => changeTextAlign('right')}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === 'right' && 'bg-gray-100'
                )}
              >
                <AlignRight className="size-4" />
              </Button>
            </Hint>
          </div>
        )}

        {isSelectedObjectText && (
          <div className="flex items-center h-full justify-center">
            <FontSizeInput
              value={properties.fontSize || FONT_SIZE}
              onChange={changeFontSize}
            />
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

        <div className="flex items-center h-full justify-center">
          <Hint label="删除 " side="bottom" sideOffset={5}>
            <Button
              onClick={() => editor?.deleteObject()}
              size="icon"
              variant="ghost"
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
