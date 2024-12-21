import React, { useEffect } from 'react';
import { JSON_KEYS } from '../types';

interface LoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setCanvasHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
  autoZoom,
  canvas,
  initialState,
  canvasHistory,
  setCanvasHistoryIndex,
}: LoadStateProps) => {
  // 用于跟踪画布是否已经初始化加载过状态
  const initiallized = React.useRef(false);

  useEffect(() => {
    // 只在画布首次加载且有初始状态时执行
    if (!initiallized.current && initialState?.current && canvas) {
      // 从JSON加载画布状态
      canvas.loadFromJSON(initialState.current, () => {
        // 保存当前状态到历史记录
        const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));
        canvasHistory.current = [currentState];
        setCanvasHistoryIndex(0);

        // 自动缩放画布以适应视图
        autoZoom();
        initiallized.current = true;
      });
    }
  }, [autoZoom, canvas, initialState, canvasHistory, setCanvasHistoryIndex]);
};
