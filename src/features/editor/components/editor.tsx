'use client';
import React, { useCallback, useEffect } from 'react';
import { useEditor } from '@/features/editor/hooks/use-editor';
import { fabric } from 'fabric';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Footer from './footer';
import { ActiveTool, selectionDependentTools } from '../types';
import ShapeSidebar from './shape-sidebar';
import FillColorSidebar from './fill-color-sidebar';
import StrokeColorSidebar from './stroke-color-sidebar';
import StrokeWidthSidebar from './stroke-width-sidebar';
const Editor = () => {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = React.useState<ActiveTool>('select');

  const onChangeActiveTool = React.useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        setActiveTool('select');
        return;
      }

      if (tool === 'draw') {
      }
      if (activeTool === 'draw') {
      }
      setActiveTool(tool);
    },
    [activeTool]
  );

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool('select');
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });

  useEffect(() => {
    // 创建一个新的 fabric.js Canvas 实例
    const canvas = new fabric.Canvas(canvasRef.current, {
      // 控制元素显示在覆盖层之上
      controlsAboveOverlay: true,
      // 保持对象堆叠顺序
      preserveObjectStacking: true,
    });

    // 初始化编辑器,传入画布和容器引用
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    // 清理函数,组件卸载时销毁画布
    return () => {
      canvas.dispose();
    };
  }, [init]);
  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div
        className="absolute h-[calc(100%-68px)] 
      w-full top-[68px] flex"
      >
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main
          className="bg-muted flex-1 overflow-auto
       relative flex flex-col"
        >
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Editor;
