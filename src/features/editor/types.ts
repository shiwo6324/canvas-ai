import { ITextOptions } from 'fabric/fabric-impl';
import * as material from 'material-colors';

export const JSON_KEYS = [
  'name',
  'gradientAngle',
  'selectable',
  'hasControls',
  'linKData',
  'editable',
  'extensionType',
  'extension',
];

export const filters = [
  { label: '无', value: 'none' },
  { label: '宝丽来', value: 'polaroid' },
  { label: '棕褐色', value: 'sepia' },
  { label: '柯达胶片', value: 'kodachrome' },
  { label: '对比度', value: 'contrast' },
  { label: '亮度', value: 'brightness' },
  { label: '布朗尼', value: 'brownie' },
  { label: '复古', value: 'vinatge' },
  { label: '特艺色彩', value: 'technicolor' },
  { label: '像素化', value: 'pixelate' },
  { label: '反相', value: 'invert' },
  { label: '模糊', value: 'blur' },
  { label: '锐化', value: 'sharpen' },
  { label: '浮雕', value: 'emboss' },
  { label: '移除颜色', value: 'removeColor' },
  { label: '黑白', value: 'blacknWhite' },
  { label: '鲜艳度', value: 'vibrance' },
  { label: '混合颜色', value: 'blendColor' },
  { label: '色相旋转', value: 'hueRotate' },
  { label: '调整大小', value: 'resize' },
  { label: '伽马值', value: 'gamma' },
];

export const fonts = [
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Arial Rounded MT Bold',
  'Arial Unicode MS',
  'Comic Sans MS',
  'Impact',
  'Geneva',
  'Trebuchet MS',
  'Verdana',
  'Lucida Sans',
  'Lucida Sans Unicode',
  'Lucida Console',
];

export const selectionDependentTools = [
  'fill',
  'stroke-color',
  'stroke-width',
  'font',
  'filter',
  'opacity',
];

export const colors = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.blue['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.grey['500'],
  material.blueGrey['500'],
  'transparent',
];

export type ActiveTool =
  | 'select'
  | 'images'
  | 'text'
  | 'shapes'
  | 'draw'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width'
  | 'font'
  | 'opacity'
  | 'filter'
  | 'settings'
  | 'ai'
  | 'remove-bg'
  | 'templates';

export type BuildEditorProps = {
  undo: () => void;
  redo: () => void;
  save: (save?: boolean) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  autoZoom: () => void;
  copy: () => void;
  paste: () => void;
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  setStrokeDashArray: (value: number[]) => void;
  selectedObjects: fabric.Object[];
  fontFamily: string;
  setFontFamily: (value: string) => void;
};

export interface Editor {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  autoZoom: () => void;
  getWorkspace: () => fabric.Object | undefined;
  changeBackground: (color: string) => void;
  changeSize: (size: { width: number; height: number }) => void;
  enableDraw: () => void;
  disableDraw: () => void;
  copy: () => void;
  paste: () => void;
  deleteObject: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  addImage: (url: string) => void;
  addText: (value: string, options?: ITextOptions) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  changeImageFilter: (value: string) => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  changeOpacity: (value: number) => void;
  changeFontFamily: (value: string) => void;
  changeFontWeight: (value: number) => void;
  changeFontStyle: (value: string) => void;
  changeFontLineThrough: (value: boolean) => void;
  changeFontUnderline: (value: boolean) => void;
  changeTextAlign: (value: string) => void;
  changeFontSize: (value: number) => void;
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[];
  getActiveObjectFillColor: () => string;
  getActiveObjectStrokeColor: () => string;
  getActiveObjectStrokeWidth: () => number;
  getActiveObjectStrokeDashArray: () => number[];
  getActiveObjectOpacity: () => number;
  getActiveObjectFontFamily: () => string;
  getActiveObjectFontWeight: () => number;
  getActiveObjectFontStyle: () => string;
  getActiveObjectFontLineThrough: () => boolean;
  getActiveObjectFontUnderline: () => boolean;
  getActiveObjectTextAlign: () => string;
  getActiveObjectFontSize: () => number;
  savePng: () => void;
  saveSvg: () => void;
  saveJpg: () => void;
  saveJson: () => void;
  importJson: (jsonString: string) => void;
}

export const FILL_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_WIDTH = 1;
export const FONT_FAMILY = 'Arial';
export const FONT_SIZE = 40;
export const FONT_WEIGHT = 400;

export interface EditorHookProps {
  clearSelectionCallback?: () => void;
  saveCallback?: (values: {
    json: string;
    width: number;
    height: number;
  }) => void;
}

export const CRICLE_OPTIONS = {
  radius: 150,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const TEXT_OPTIONS = {
  type: 'textbox',
  fill: FILL_COLOR,
  left: 100,
  top: 100,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export const STROKE_DASH_ARRAY = [];
