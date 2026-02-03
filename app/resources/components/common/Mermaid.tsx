"use client";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
  className?: string;
}

// Global counter for unique IDs across all instances
let mermaidIdCounter = 0;

export function Mermaid({ chart, className = "" }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const idRef = useRef<string>(`mermaid-${++mermaidIdCounter}-${Date.now()}`);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart.trim()) {
        if (isMounted) {
          setError("Empty chart definition");
        }
        return;
      }

      try {
        // Initialize mermaid with configuration (safe to call multiple times)
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        });

        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart);

        if (isMounted) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to render chart");
        }
      }
    };

    void renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  if (error) {
    return (
      <div
        className={`my-4 p-4 rounded-lg border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 ${className}`}>
        <div className="flex items-start gap-2">
          <span className="text-red-600 dark:text-red-400 font-semibold">⚠️ Mermaid Error:</span>
          <code className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</code>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-4 relative ${className}`}>
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-1">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title="Zoom In"
          aria-label="Zoom In">
          <ZoomIn className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out">
          <ZoomOut className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title="Reset"
          aria-label="Reset Zoom">
          <RotateCcw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {/* Diagram Container */}
      <div
        ref={containerRef}
        className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden ${
          isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}>
        <div
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: "top left",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Zoom Indicator */}
      {zoom !== 1 && (
        <div className="absolute bottom-2 right-2 bg-slate-900/75 dark:bg-slate-100/75 text-white dark:text-slate-900 text-xs px-2 py-1 rounded">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
