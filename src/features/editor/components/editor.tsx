'use client';
import React, { useEffect } from 'react';
import { useEditor } from '@/features/editor/hooks/use-editor';
import { fabric } from 'fabric';

const Editor = () => {
  const { init } = useEditor();

  const canvasRef = React.useRef(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
  }, [init]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full bg-muted" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Editor;
