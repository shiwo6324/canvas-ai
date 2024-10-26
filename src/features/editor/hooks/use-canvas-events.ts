import { fabric } from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
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
      });
    }
  }, [canvas]);

  // 返回一个清理函数，用于在组件卸载时移除事件监听器
  return () => {
    if (canvas) {
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
    }
  };
};
