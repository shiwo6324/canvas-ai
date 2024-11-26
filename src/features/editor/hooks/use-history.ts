import { useCallback, useRef, useState } from 'react';
import { JSON_KEYS } from '../types';

interface UseHistoryProps {
  canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
  // 当前历史记录的索引
  const [historyIndex, setHistoryIndex] = useState(0);
  // 存储画布历史状态的数组
  const canvasHistory = useRef<string[]>([]);
  // 是否跳过保存的标志
  const skipSave = useRef(false);

  // 检查是否可以撤销
  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  // 检查是否可以重做
  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  // 保存当前画布状态到历史记录
  const save = useCallback(
    (skip = false) => {
      if (!canvas) return;

      // 将画布转换为 JSON 格式
      const currentState = canvas.toJSON(JSON_KEYS);
      const json = JSON.stringify(currentState);

      // 如果不是跳过保存状态，则添加到历史记录
      if (!skip && !skipSave.current) {
        canvasHistory.current.push(json);
        setHistoryIndex(canvasHistory.current.length - 1);
      }

      // 重置跳过保存标志
      skipSave.current = false;
    },
    [canvas]
  );

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = canvasHistory.current[previousIndex];
      const state = JSON.parse(previousState);
      canvas?.loadFromJSON(state, () => {
        canvas?.renderAll();
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [canvas, canUndo, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = canvasHistory.current[nextIndex];
      const state = JSON.parse(nextState);
      canvas?.loadFromJSON(state, () => {
        canvas?.renderAll();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canvas, canRedo, historyIndex]);

  return {
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex,
    canvasHistory,
  };
};
