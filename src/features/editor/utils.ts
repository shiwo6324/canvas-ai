import { RGBColor } from 'react-color';
import { fabric } from 'fabric';

export function isTextType(type: string | undefined) {
  return type === 'text' || type === 'i-text' || type === 'textbox';
}

export function rgbaObjectToString(rgba: RGBColor | 'transparent'): string {
  if (rgba === 'transparent') return `rgba(0,0,0,0)`;
  const { r, g, b, a } = rgba;
  const alpha = a !== undefined ? a : 1;
  return `rgba(${r},${g},${b},${alpha})`;
}

export const createFilter = (filter: string) => {
  let effect;

  switch (filter) {
    case 'polaroid':
      // 宝丽来效果 - 创建一个具有复古宝丽来相机特征的滤镜
      // @ts-ignore
      effect = new fabric.Image.filters.Polaroid();
      break;
    case 'sepia':
      // 棕褐色效果 - 将图像转换为暖色调的复古外观
      effect = new fabric.Image.filters.Sepia();
      break;
    case 'kodachrome':
      // 柯达胶片效果 - 模拟经典柯达胶片的色彩特征
      // @ts-ignore
      effect = new fabric.Image.filters.Kodachrome();
      break;
    case 'contrast':
      // 对比度 - 增加图像的对比度，使亮暗部分差异更明显
      effect = new fabric.Image.filters.Contrast({ contrast: 0.3 });
      break;
    case 'brightness':
      // 亮度 - 调整图像的整体亮度
      effect = new fabric.Image.filters.Brightness({ brightness: 0.8 });
      break;
    case 'brownie':
      // 布朗尼效果 - 创建一个复古的棕色调滤镜
      // @ts-ignore
      effect = new fabric.Image.filters.Brownie();
      break;
    case 'vinatge':
      // 复古效果 - 添加老照片般的复古风格
      // @ts-ignore
      effect = new fabric.Image.filters.Vintage();
      break;
    case 'technicolor':
      // 特艺色彩效果 - 模拟早期电影的鲜艳色彩处理技术
      // @ts-ignore
      effect = new fabric.Image.filters.Technicolor();
      break;
    case 'pixelate':
      // 像素化 - 将图像分割成大的像素块
      effect = new fabric.Image.filters.Pixelate();
      break;
    case 'invert':
      // 反相 - 反转图像的所有颜色
      effect = new fabric.Image.filters.Invert();
      break;
    case 'blur':
      // 模糊 - 对图像应用高斯模糊效果
      effect = new fabric.Image.filters.Blur();
      break;
    case 'sharpen':
      // 锐化 - 增强图像的边缘细节
      effect = new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case 'emboss':
      // 浮雕 - 创建图像的浮雕效果
      effect = new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case 'removeColor':
      // 移除颜色 - 根据阈值和距离参数移除特定颜色
      // @ts-ignore
      effect = new fabric.Image.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case 'blacknWhite':
      // 黑白效果 - 将图像转换为黑白色调
      // @ts-ignore
      effect = new fabric.Image.filters.BlackWhite();
      break;
    case 'vibrance':
      // 自然饱和度 - 智能增加图像的色彩饱和度
      // @ts-ignore
      effect = new fabric.Image.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case 'blendColor':
      // 颜色混合 - 将指定颜色与图像进行混合
      // @ts-ignore
      effect = new fabric.Image.filters.BlendColor({
        color: '#00ff00',
        mode: 'multiply',
      });
      break;
    case 'hueRotate':
      // 色相旋转 - 在色轮上旋转图像的色相
      // @ts-ignore
      effect = new fabric.Image.filters.HueRotate({
        hue: 0.5,
      });
      break;
    case 'resize':
      // 调整大小 - 重新调整图像尺寸
      // @ts-ignore
      effect = new fabric.Image.filters.Resize();
      break;
    case 'gamma':
      // 伽马校正 - 调整图像的伽马值以改变亮度和对比度
      // @ts-ignore
      effect = new fabric.Image.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    default:
      // 如果没有匹配的滤镜类型，返回null
      effect = null;
      return;
  }

  return effect;
};
