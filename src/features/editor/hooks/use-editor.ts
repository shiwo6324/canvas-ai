import React, { useCallback, useMemo } from 'react';
import { fabric } from 'fabric';
import { useAutoResize } from './use-auto-resize';
import {
  BuildEditorProps,
  CRICLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
} from '../types';
import { useCanvasEvents } from './use-canvas-events';
import { isTextType } from '../utils';
import { ITextOptions } from 'fabric/fabric-impl';

// 构建编辑器函数，接收一个包含 canvas 属性的对象作为参数
const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDashArray,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  selectedObjects,
}: BuildEditorProps): Editor => {
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
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
    },
    getActiveObjectOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get('opacity') || 1;
      }
      return 1;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });
      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      // 获取画布上所有当前被选中的对象
      canvas.getActiveObjects().forEach((object) => {
        // 设置每个选中对象的 fill 属性
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // 如果是文本对象，设置填充颜色（即文本颜色，fill 属性用于设置文本颜色）
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        // 如果是其他类型的对象，设置边框颜色
        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    // 添加圆形的方法
    addCircle: () => {
      // 创建一个新的 fabric.Circle 对象
      const object = new fabric.Circle({
        ...CRICLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      // 创建一个新的 fabric.Circle 对象
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
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
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
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
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    // 获取当前选中对象的填充颜色
    getActiveObjectFillColor: () => {
      // 获取第一个选中的对象
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // 如果有选中对象，获取其填充颜色
        // 如果对象没有填充颜色，则使用默认的fillColor
        const value = selectedObject.get('fill') || fillColor;
        return value as string;
      }

      // 如果没有选中对象，返回默认的fillColor
      return fillColor;
    },
    getActiveObjectStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get('stroke') || strokeColor;
      }
      return strokeColor;
    },
    getActiveObjectStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get('strokeWidth') || strokeWidth;
      }
      return strokeWidth;
    },
    getActiveObjectStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get('strokeDashArray') || strokeDashArray;
      }
      return strokeDashArray;
    },
    canvas,
    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  // 创建 canvas 和 container 状态
  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = React.useState<fabric.Object[]>(
    []
  );

  const [fillColor, setFillColor] = React.useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = React.useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = React.useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    React.useState<number[]>(STROKE_DASH_ARRAY);

  // 使用 useAutoResize hook 来自动调整画布大小
  // 这个 hook 会监听 container 的大小变化，并相应地调整 canvas 的尺寸
  // 确保画布始终填满容器，保持响应式布局
  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  // 编辑器对象
  // 只有当 canvas 发生变化时才重新创建编辑器
  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        strokeDashArray,
        setStrokeDashArray,
      });
    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
  ]);

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

      // initialCanvas.add(test);
    },
    []
  );

  // 返回初始化函数
  return { init, editor };
};
