import { ITextOptions } from 'fabric/fabric-impl';
import * as material from 'material-colors';

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
}

export const FILL_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_COLOR = 'rgba(0, 0, 0, 1)';
export const STROKE_WIDTH = 1;
export const FONT_FAMILY = 'Arial';
export const FONT_SIZE = 40;
export const FONT_WEIGHT = 400;

export interface EditorHookProps {
  clearSelectionCallback?: () => void;
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
