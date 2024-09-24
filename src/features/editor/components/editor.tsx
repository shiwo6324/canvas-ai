'use client';
import React, { useEffect } from 'react';
import { useEditor } from '@/features/editor/hooks/use-editor';
import { fabric } from 'fabric';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Footer from './footer';
import { ActiveTool } from '../types';
import ShapeSidebar from './shape-sidebar';

const Editor = () => {
  const { init } = useEditor();
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

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
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
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main
          className="bg-muted flex-1 overflow-auto
       relative flex flex-col"
        >
          <Toolbar />
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
