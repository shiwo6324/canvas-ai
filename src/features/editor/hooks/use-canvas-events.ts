import { fabric } from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
  save?: () => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on('object:added', () => save?.());
      canvas.on('object:removed', () => save?.());
      canvas.on('object:modified', () => save?.());
      // 监听画布上的选择创建事件
      canvas.on('selection:created', (e) => {
        setSelectedObjects(e.selected || []);
      });
      // 监听画布上的选择更新事件
      canvas.on('selection:updated', (e) => {
        setSelectedObjects(e.selected || []);
      });
      // 监听画布上的选择清除事件
      canvas.on('selection:cleared', () => {
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });
    }
  }, [canvas, clearSelectionCallback, save]);

  // 返回一个清理函数，用于在组件卸载时移除事件监听器
  return () => {
    if (canvas) {
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
      canvas.off('object:added');
      canvas.off('object:removed');
      canvas.off('object:modified');
    }
  };
};
