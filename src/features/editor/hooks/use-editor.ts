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
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
} from '../types';
import { useCanvasEvents } from './use-canvas-events';
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText,
} from '../utils';
import { useClipboard } from './use-clipboard';
import { useHistory } from './use-history';
import { useHotKeys } from './use-hot-keys';
import { useWindowEvents } from './use-window-events';

// 构建编辑器函数，接收一个包含 canvas 属性的对象作为参数
const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDashArray,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  fontFamily,
  setFontFamily,
  selectedObjects,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: 'image',
      foramt: 'png',
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, 'png');
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, 'svg');
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, 'jpg');
    autoZoom();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);
    // Transform the text objects to textarea so that no data is lost when importing the JSON
    transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downloadFile(fileString, 'json');
  };

  const importJson = (jsonString: string) => {
    const data = JSON.parse(jsonString);

    canvas.loadFromJSON(data, () => {
      canvas.renderAll();
      // reset the zoom level
      autoZoom();
    });
  };

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
    savePng,
    saveSvg,
    saveJpg,
    saveJson,
    importJson,
    autoZoom,
    getWorkspace,
    onUndo: () => undo(),
    onRedo: () => redo(),
    canUndo,
    canRedo,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },
    changeSize: (size: { width: number; height: number }) => {
      const workSpace = getWorkspace();
      workSpace?.set(size);
      autoZoom();
      save();
    },
    changeBackground: (color: string) => {
      const workSpace = getWorkspace();
      workSpace?.set({ fill: color });
      canvas.renderAll();
      save();
    },
    enableDraw: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDraw: () => {
      canvas.isDrawingMode = false;
    },
    copy,
    paste,
    changeImageFilter: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object.type === 'image') {
          const imageObject = object as fabric.Image;
          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (url: string) => {
      fabric.Image.fromURL(
        url,
        (img) => {
          const workSpace = getWorkspace();
          img.scaleToWidth(workSpace?.width || 0);
          img.scaleToHeight(workSpace?.height || 0);
          addToCanvas(img);
        },
        {
          crossOrigin: 'anonymous',
        }
      );
    },
    deleteObject: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    changeFontLineThrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
    },

    getActiveObjectFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        return selectedObject.get('fontSize') || FONT_SIZE;
      }
      return FONT_SIZE;
    },
    getActiveObjectTextAlign: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        return selectedObject.get('textAlign') || 'left';
      }
      return 'left';
    },
    getActiveObjectFontUnderline: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        return selectedObject.get('underline') || false;
      }
      return false;
    },
    getActiveObjectFontLineThrough: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        return selectedObject.get('linethrough') || false;
      }
      return false;
    },
    getActiveObjectFontStyle: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        return selectedObject.get('fontStyle') || 'normal';
      }
      return 'normal';
    },
    getActiveObjectOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get('opacity') || 1;
      }
      return 1;
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
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

      canvas.freeDrawingBrush.width = value;
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
      canvas.freeDrawingBrush.color = value;
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
    getActiveObjectFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        const value = selectedObject.get('fontFamily') || fontFamily;
        return value;
      }

      // 如果没有选中对象，返回默认的fillColor
      return fontFamily;
    },
    getActiveObjectFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        // @ts-ignore
        const value = selectedObject.get('fontWeight') || FONT_WEIGHT;
        return value;
      }

      // 如果没有选中对象，返回默认的fillColor
      return FONT_WEIGHT;
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
  const [fontFamily, setFontFamily] = React.useState(FONT_FAMILY);
  const [strokeDashArray, setStrokeDashArray] =
    React.useState<number[]>(STROKE_DASH_ARRAY);

  // 使用 useClipboard hook 来获取剪贴板内容
  const { copy, paste } = useClipboard({ canvas });

  useWindowEvents();

  const { save, undo, redo, canRedo, canUndo, canvasHistory, setHistoryIndex } =
    useHistory({ canvas });

  // 使用 useAutoResize hook 来自动调整画布大小
  // 这个 hook 会监听 container 的大小变化，并相应地调整 canvas 的尺寸
  // 确保画布始终填满容器，保持响应式布局
  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotKeys({
    canvas,
    undo,
    redo,
    save,
    copy,
    paste,
  });

  // 编辑器对象
  // 只有当 canvas 发生变化时才重新创建编辑器
  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        save,
        canRedo,
        canUndo,
        redo,
        undo,
        autoZoom,
        copy,
        paste,
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
        fontFamily,
        setFontFamily,
      });
    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    autoZoom,
    canRedo,
    canUndo,
    save,
    undo,
    redo,
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

      const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);

      // initialCanvas.add(test);
    },
    [canvasHistory, setHistoryIndex]
  );

  // 返回初始化函数
  return { init, editor };
};
