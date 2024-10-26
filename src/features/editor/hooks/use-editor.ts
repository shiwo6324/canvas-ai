import React, { useCallback, useMemo } from 'react';
import { fabric } from 'fabric';
import { useAutoResize } from './use-auto-resize';
import {
  BuildEditorProps,
  CRICLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
} from '../types';

// 构建编辑器函数，接收一个包含 canvas 属性的对象作为参数
const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === 'clip');
  };
  const center = (object: fabric.Object) => {
    const workSpace = getWorkspace();
    const center = workSpace?.getCenterPoint();
    if (!center) return;
    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  return {
    // 添加圆形的方法
    addCircle: () => {
      // 创建一个新的 fabric.Circle 对象
      const object = new fabric.Circle({
        ...CRICLE_OPTIONS,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      // 创建一个新的 fabric.Circle 对象
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = 400;
      const WIDTH = 400;

      const object = new fabric.Polygon(
        [
          {
            x: 0,
            y: 0,
          },
          {
            x: WIDTH,
            y: 0,
          },
          {
            x: WIDTH / 2,
            y: HEIGHT,
          },
        ],
        {
          ...TRIANGLE_OPTIONS,
        }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          {
            x: WIDTH / 2,
            y: 0,
          },
          {
            x: WIDTH,
            y: HEIGHT / 2,
          },
          {
            x: WIDTH / 2,
            y: HEIGHT,
          },
          {
            x: 0,
            y: HEIGHT / 2,
          },
        ],
        {
          ...DIAMOND_OPTIONS,
        }
      );
      addToCanvas(object);
    },
  };
};

export const useEditor = () => {
  // 创建 canvas 和 container 状态
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  // 使用 useAutoResize hook 来自动调整画布大小
  // 这个 hook 会监听 container 的大小变化，并相应地调整 canvas 的尺寸
  // 确保画布始终填满容器，保持响应式布局
  useAutoResize({
    canvas,
    container,
  });

  // 编辑器对象
  // 使用 useMemo 创建并缓存编辑器对象
  // 只有当 canvas 发生变化时才重新创建编辑器
  // 如果 canvas 存在，则调用 buildEditor 函数创建编辑器
  // 如果 canvas 不存在，则返回 undefined
  const editor = useMemo(() => {
    if (canvas) return buildEditor({ canvas });
    return undefined;
  }, [canvas]);

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

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const test = new fabric.Rect({
        width: 100,
        height: 100,
        fill: 'black',
      });

      initialCanvas.add(test);
    },
    []
  );

  // 返回初始化函数
  return { init, editor };
};
