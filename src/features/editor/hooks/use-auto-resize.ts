import React, { useCallback } from 'react';
import { fabric } from 'fabric';

// 定义 useAutoResize 的参数接口
interface UserAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UserAutoResizeProps) => {
  // 定义 autoZoom 函数，用于自动调整画布大小和缩放
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    // 获取容器的宽度和高度
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // 设置画布的宽度和高度
    canvas.setWidth(width);
    canvas.setHeight(height);

    // 获取画布中心点
    const center = canvas.getCenter();
    // 设置缩放比例
    const zoomRatio = 0.85;
    // 查找名为 'clip' 的对象，通常是工作区域
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name === 'clip');

    // 计算适合容器的缩放比例
    // @ts-ignore
    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width,
      height,
    });

    // 计算最终的缩放值
    const zoom = zoomRatio * scale;

    // 重置画布视图变换
    canvas.setViewportTransform(fabric.iMatrix.concat());
    // 将画布缩放到指定点和缩放级别
    canvas.zoomToPoint(new fabric.Point(center.left, center.left), zoom);

    if (!localWorkspace) return;

    // 获取工作区中心点
    const workSpaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    // 调整视图变换以居中工作区
    viewportTransform[4] =
      canvas.width / 2 - workSpaceCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - workSpaceCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);

    // 克隆工作区并设置为画布的裁剪路径
    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  // 使用 useEffect 来设置 ResizeObserver
  React.useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      // 创建 ResizeObserver 以监听容器大小变化
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });
      resizeObserver?.observe(container);
    }
    // 清理函数，用于在组件卸载时断开 ResizeObserver
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [canvas, container, autoZoom]);
  return { autoZoom };
};
