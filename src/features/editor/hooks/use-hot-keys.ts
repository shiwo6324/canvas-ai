import { useEventListener } from 'ahooks';
import { fabric } from 'fabric';

// 定义useHotKeys钩子的属性接口
interface UseHotKeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (isSaveAs?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

// 处理键盘快捷键的自定义钩子
export const useHotKeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
}: UseHotKeysProps) => {
  useEventListener('keydown', (ev) => {
    const isCtrl = ev.ctrlKey || ev.metaKey;
    const isBackspace = ev.key === 'Backspace';
    // 检查当前焦点是否在输入框或文本域中
    const isInput = ['INPUT', 'TEXTAREA'].includes(
      (ev.target as HTMLElement).tagName || ''
    );

    // 如果焦点在输入框中，不处理快捷键
    if (isInput) return;

    // 处理退格键删除选中对象
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    // 处理需要Ctrl/Command键的快捷键组合
    if (isCtrl) {
      switch (ev.key) {
        case 'z': // Ctrl+Z：撤销
          ev.preventDefault();
          undo();
          break;
        case 'y': // Ctrl+Y：重做
          ev.preventDefault();
          redo();
          break;
        case 'c': // Ctrl+C：复制
          ev.preventDefault();
          copy();
          break;
        case 'v': // Ctrl+V：粘贴
          ev.preventDefault();
          paste();
          break;
        case 's': // Ctrl+S：保存
          ev.preventDefault();
          save(true);
          break;
        case 'a': // Ctrl+A：全选
          ev.preventDefault();

          canvas?.discardActiveObject(); // 先清除当前选中状态

          const allObjects = canvas
            ?.getObjects()
            .filter((obj) => obj.selectable); // 获取所有可选择的对象

          if (allObjects) {
            // 创建多选组并设置为当前选中对象
            canvas?.setActiveObject(
              new fabric.ActiveSelection(allObjects, { canvas })
            );
          }

          canvas?.renderAll(); // 重新渲染画布
          break;
      }
    }
  });
};
