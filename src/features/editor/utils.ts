import { RGBColor } from 'react-color';

export function isTextType(type: string | undefined) {
  return type === 'text' || type === 'i-text' || type === 'textbox';
}

export function rgbaObjectToString(rgba: RGBColor | 'transparent'): string {
  if (rgba === 'transparent') return `rgba(0,0,0,0)`;
  const { r, g, b, a } = rgba;
  const alpha = a !== undefined ? 1 : a;
  return `rgba(${r},${g},${b},${alpha})`;
}
