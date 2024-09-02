import React, { useCallback } from 'react';
import { fabric } from 'fabric';
import { useAutoResize } from './use-auto-resize';

export const useEditor = () => {
  // 创建 canvas 和 container 状态
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  // 使用 useAutoResize Hook
  useAutoResize({
    canvas,
    container,
  });

  // 定义初始化函数
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: any;
      initialContainer: HTMLDivElement;
    }) => {
      // 设置 fabric.Object 的默认属性
      fabric.Object.prototype.set({
        cornerColor: '#fff',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      });

      // 创建初始工作区
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: 'clip',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,.8)',
          blur: 5,
        }),
      });

      // 设置画布尺寸
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      // 添加工作区到画布并居中
      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      // 更新状态
      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  // 返回初始化函数
  return { init };
};
