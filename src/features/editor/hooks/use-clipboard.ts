import { fabric } from 'fabric';
import { useCallback, useRef } from 'react';

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}
export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<any>(null);

  const copy = useCallback(() => {
    if (!canvas) return;
    // 克隆当前选中的对象并存储到剪贴板
    canvas.getActiveObject()?.clone((cloned: any) => {
      clipboard.current = cloned;
    });
  }, [canvas]);

  const paste = useCallback(() => {
    // 如果画布不存在或剪贴板为空则返回
    if (!canvas || !clipboard.current) return;
    // 克隆剪贴板中的对象
    clipboard.current.clone((clonedObject: any) => {
      // 取消当前选中状态
      canvas.discardActiveObject();
      // 设置克隆对象的位置和事件
      clonedObject.set({
        left: clonedObject.left + 10, // 向右偏移10像素
        top: clonedObject.top + 10, // 向下偏移10像素
        evented: true,
      });

      // 处理多选情况
      if (clonedObject.type === 'activeSelection') {
        clonedObject.canvas = canvas;
        // 遍历选中的每个对象并添加到画布
        clonedObject.forEachObject((obj: any) => {
          canvas.add(obj);
        });
        clonedObject.setCoords();
      } else {
        // 单个对象直接添加到画布
        canvas.add(clonedObject);
      }

      // 更新剪贴板中对象的位置
      clipboard.current.top += 10;
      clipboard.current.left += 10;
      // 选中新粘贴的对象
      canvas.setActiveObject(clonedObject);
      // 重新渲染画布
      canvas.requestRenderAll();
    });
  }, [canvas]);

  return { copy, paste };
};
