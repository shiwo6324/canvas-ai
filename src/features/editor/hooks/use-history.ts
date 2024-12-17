import { fabric } from 'fabric';
import React, { useCallback } from 'react';
import { JSON_KEYS } from '../types';

type Props = {
  canvas: fabric.Canvas | null;
  saveCallback?: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
};

export const useHistory = ({ canvas, saveCallback }: Props) => {
  const [historyIndex, setHistoryIndex] = React.useState<number>(0); // 用于跟踪历史数组中的当前索引。如果我们在数组的开头或结尾，我们将禁用撤销/重做按钮
  const canvasHistory = React.useRef<string[]>([]); // 我们的画布的JSON字符串化历史记录
  // 当我们撤销/重做历史记录时，画布事件将被触发，因此我们需要跳过保存画布的当前状态，否则它将被添加到历史数组中
  const skipSave = React.useRef<boolean>(false); // 当我们撤销/重做时，用于跳过保存画布的当前状态

  // 我们使用useCallback是因为我们希望save函数能够在其他依赖项中调用
  const save = React.useCallback(
    (skip = false) => {
      if (!canvas) return;
      // 🚨 默认情况下toJSON不会将所有属性导出到JSON。请确保手动添加任何你想要保留的属性
      const currentCanvasState = canvas.toJSON(JSON_KEYS);
      const currentCanvasStateString = JSON.stringify(currentCanvasState);

      if (!skipSave.current && !skip) {
        canvasHistory.current.push(currentCanvasStateString);
        setHistoryIndex(canvasHistory.current.length - 1);
      }

      const workspace = canvas
        .getObjects()
        .find((object) => object.name === 'clip');
      const height = workspace?.height || 0;
      const width = workspace?.width || 0;

      saveCallback?.({
        json: currentCanvasStateString,
        height,
        width,
      });
    },
    [canvas, saveCallback]
  );

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (!canvas || !canUndo()) return;

    // 跳过将当前画布状态保存到历史记录中
    // 🚨 重要提示：这应该在canvas.clear()方法之前执行
    skipSave.current = true;

    // 在加载前一个状态之前清除画布
    canvas?.clear().renderAll();

    // 减少历史索引
    const prevHistoryIndex = historyIndex - 1;
    const prevHistory = JSON.parse(canvasHistory.current[prevHistoryIndex]);

    // 从历史数组中加载画布的前一个状态
    canvas.loadFromJSON(prevHistory, () => {
      // 加载画布状态后，渲染画布
      canvas.renderAll();
      setHistoryIndex(prevHistoryIndex);
      skipSave.current = false;
    });
  }, [canvas, historyIndex, canUndo]);

  const redo = useCallback(() => {
    if (!canvas || !canRedo()) return;

    // 跳过将当前画布状态保存到历史记录中
    // 🚨 重要提示：这应该在canvas.clear()方法之前执行
    skipSave.current = true;

    // 在加载下一个状态之前清除画布
    canvas?.clear().renderAll();

    // 增加历史索引
    const nextHistoryIndex = historyIndex + 1;
    const nextHistory = JSON.parse(canvasHistory.current[nextHistoryIndex]);

    // 从历史数组中加载画布的下一个状态
    canvas.loadFromJSON(nextHistory, () => {
      // 加载画布状态后，渲染画布
      canvas.renderAll();
      setHistoryIndex(nextHistoryIndex);
      skipSave.current = false;
    });
  }, [canvas, historyIndex, canRedo]);

  return { save, canUndo, canRedo, undo, redo, setHistoryIndex, canvasHistory };
};
