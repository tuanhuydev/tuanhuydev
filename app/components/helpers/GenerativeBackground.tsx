"use client";

import React, { useState, useRef, useCallback, CSSProperties } from "react";

// --- Helper Functions & Types ---
const hexToRgbString = (hex?: string): string => {
  if (!hex) return "0,0,0";
  const hexValue = hex.startsWith("#") ? hex.slice(1) : hex;
  const shorthandRegex = /^([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hexValue.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0,0,0";
};

interface ColorStop {
  start: string;
  end: string;
}

interface ColorsConfig {
  warmNeutral: ColorStop;
  mutedPurple: ColorStop;
  desaturatedBlue: ColorStop;
  goldenSunset: ColorStop;
}

type ColorZoneKey = keyof ColorsConfig;

const defaultColorsConfig: ColorsConfig = {
  warmNeutral: { start: "#D4BFA7", end: "#BDA38D" },
  mutedPurple: { start: "#A090C0", end: "#8573B5" },
  desaturatedBlue: { start: "#4C4F6E", end: "#363854" },
  goldenSunset: { start: "#F2C978", end: "#D4B05A" },
};

// --- AbstractGradientBackground (Preview Panel) ---
interface AbstractGradientBackgroundProps {
  colors: ColorsConfig;
  noiseOpacity: number;
  width: string | number;
  height: string | number;
  overlayText: string;
  overlayTextSize: number;
  fontFamily?: string;
}

const AbstractGradientBackground: React.FC<AbstractGradientBackgroundProps> = ({
  colors,
  noiseOpacity,
  width,
  height,
  overlayText,
  overlayTextSize,
  fontFamily = "var(--font-momo), system-ui, arial, sans-serif",
}) => {
  const rgbWarmNeutralFade = hexToRgbString(colors.warmNeutral.end);
  const rgbMutedPurpleFade = hexToRgbString(colors.mutedPurple.end);
  const rgbDesaturatedBlueFade = hexToRgbString(colors.desaturatedBlue.end);
  const rgbGoldenSunsetFade = hexToRgbString(colors.goldenSunset.end);

  const backgroundStyle: CSSProperties = {
    width,
    height,
    backgroundColor: colors.desaturatedBlue.end,
    position: "relative",
    overflow: "hidden",
    backgroundImage: `
      radial-gradient(farthest-corner ellipse at 50% 100%, 
        ${colors.desaturatedBlue.start} 0%, 
        ${colors.desaturatedBlue.end} 30%, 
        rgba(${rgbDesaturatedBlueFade}, 0) 70%),
      radial-gradient(farthest-corner ellipse at 0% 50%, 
        ${colors.warmNeutral.start} 0%, 
        ${colors.warmNeutral.end} 20%, 
        rgba(${rgbWarmNeutralFade}, 0) 55%),
      radial-gradient(farthest-corner ellipse at 50% 0%, 
        ${colors.mutedPurple.start} 0%, 
        ${colors.mutedPurple.end} 25%, 
        rgba(${rgbMutedPurpleFade}, 0) 65%),
      radial-gradient(farthest-corner ellipse at 100% 0%, 
        ${colors.goldenSunset.start} 0%, 
        ${colors.goldenSunset.end} 20%, 
        rgba(${rgbGoldenSunsetFade}, 0) 60%)
    `,
    backgroundRepeat: "no-repeat",
    border: "1px solid #ccc", // To visualize the panel boundaries
    boxSizing: "border-box",
  };

  const noiseStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: noiseOpacity,
    pointerEvents: "none",
    zIndex: 1,
  };

  const overlayTextStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontSize: `${overlayTextSize}px`,
    fontFamily: fontFamily,
    textAlign: "center",
    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
    zIndex: 2,
    padding: "10px",
    width: "90%", // Prevent text from touching edges
    wordBreak: "break-word",
  };

  return (
    <div style={backgroundStyle} id="gradient-preview-panel">
      {" "}
      {/* ID for html2canvas */}
      <div style={noiseStyle} />
      {overlayText && <div style={overlayTextStyle}>{overlayText}</div>}
    </div>
  );
};

// --- ControlPanel ---
interface ControlPanelProps {
  colors: ColorsConfig;
  onColorChange: (zone: ColorZoneKey, type: "start" | "end", value: string) => void;
  noiseOpacity: number;
  onNoiseOpacityChange: (value: number) => void;
  previewWidth: string;
  onPreviewWidthChange: (value: string) => void;
  previewHeight: string;
  onPreviewHeightChange: (value: string) => void;
  overlayText: string;
  onOverlayTextChange: (value: string) => void;
  overlayTextSize: number;
  onOverlayTextSizeChange: (value: number) => void;
  onDownload: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const {
    colors,
    onColorChange,
    noiseOpacity,
    onNoiseOpacityChange,
    previewWidth,
    onPreviewWidthChange,
    previewHeight,
    onPreviewHeightChange,
    overlayText,
    onOverlayTextChange,
    overlayTextSize,
    onOverlayTextSizeChange,
    onDownload,
  } = props;

  const controlGroupStyle: CSSProperties = {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  };
  const labelStyle: CSSProperties = { display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "0.9em" };
  const inputStyle: CSSProperties = {
    width: "calc(100% - 12px)",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };
  const colorInputStyle: CSSProperties = {
    ...inputStyle,
    width: "calc(50% - 12px)",
    display: "inline-block",
    marginRight: "4px",
  };
  const buttonStyle: CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1em",
    marginTop: "10px",
  };
  const smallInputStyle: CSSProperties = { ...inputStyle, width: "80px", marginRight: "10px" };

  return (
    <div style={{ padding: "20px", maxHeight: "100vh", overflowY: "auto" }}>
      <h2 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Customize Background</h2>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Preview Dimensions (CSS units, e.g., px, %)</label>
        <input
          type="text"
          style={smallInputStyle}
          value={previewWidth}
          onChange={(e) => onPreviewWidthChange(e.target.value)}
          placeholder="Width (e.g. 400px)"
        />
        <input
          type="text"
          style={smallInputStyle}
          value={previewHeight}
          onChange={(e) => onPreviewHeightChange(e.target.value)}
          placeholder="Height (e.g. 300px)"
        />
      </div>

      {(Object.keys(colors) as ColorZoneKey[]).map((zone) => (
        <div key={zone} style={controlGroupStyle}>
          <label style={labelStyle}>{zone.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</label>
          <div>
            <input
              type="color"
              style={{ ...colorInputStyle, padding: "2px", height: "38px" }}
              value={colors[zone].start}
              onChange={(e) => onColorChange(zone, "start", e.target.value)}
            />
            <input
              type="text"
              style={colorInputStyle}
              value={colors[zone].start}
              onChange={(e) => onColorChange(zone, "start", e.target.value)}
            />
          </div>
          <div>
            <input
              type="color"
              style={{ ...colorInputStyle, padding: "2px", height: "38px" }}
              value={colors[zone].end}
              onChange={(e) => onColorChange(zone, "end", e.target.value)}
            />
            <input
              type="text"
              style={colorInputStyle}
              value={colors[zone].end}
              onChange={(e) => onColorChange(zone, "end", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Noise Opacity: {noiseOpacity.toFixed(2)}</label>
        <input
          type="range"
          style={{ width: "100%" }}
          min="0"
          max="0.3"
          step="0.01"
          value={noiseOpacity}
          onChange={(e) => onNoiseOpacityChange(parseFloat(e.target.value))}
        />
      </div>

      <div style={controlGroupStyle}>
        <label style={labelStyle}>Overlay Text</label>
        <input
          type="text"
          style={inputStyle}
          value={overlayText}
          onChange={(e) => onOverlayTextChange(e.target.value)}
          placeholder="Enter text for preview"
        />
        <label style={labelStyle}>Text Size (px): {overlayTextSize}</label>
        <input
          type="range"
          style={{ width: "100%" }}
          min="10"
          max="100"
          step="1"
          value={overlayTextSize}
          onChange={(e) => onOverlayTextSizeChange(parseInt(e.target.value))}
        />
      </div>

      <button style={buttonStyle} onClick={onDownload}>
        Download Background
      </button>
    </div>
  );
};

// --- App (Main Component) ---
const GenerativeBackground: React.FC = () => {
  const [colors, setColors] = useState<ColorsConfig>(defaultColorsConfig);
  const [noiseOpacity, setNoiseOpacity] = useState<number>(0.03);
  const [previewWidth, setPreviewWidth] = useState<string>("500px");
  const [previewHeight, setPreviewHeight] = useState<string>("350px");
  const [overlayText, setOverlayText] = useState<string>("Your Text Here");
  const [overlayTextSize, setOverlayTextSize] = useState<number>(30);

  const previewPanelRef = useRef<HTMLDivElement>(null); // For html2canvas, though we target by ID

  const handleColorChange = (zone: ColorZoneKey, type: "start" | "end", value: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [zone]: { ...prevColors[zone], [type]: value },
    }));
  };

  const handleDownload = useCallback(async () => {
    const panel = document.getElementById("gradient-preview-panel");
    if (panel) {
      const { default: html2canvas } = await import("html2canvas");
      html2canvas(panel, {
        useCORS: true, // Important if any external resources were used (not in this case)
        backgroundColor: null, // Use transparent background for the canvas capture if element is transparent
        width: panel.offsetWidth,
        height: panel.offsetHeight,
        scale: 2, // Increase scale for better resolution
      })
        .then((canvas: HTMLCanvasElement) => {
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = "custom-gradient-background.png";
          link.href = image;
          link.click();
        })
        .catch((error: any) => {
          console.error("Error generating image with html2canvas:", error);
          // Show a user-friendly message
          const messageBox = document.createElement("div");
          messageBox.textContent = "Error generating image. Check console for details.";
          messageBox.style.cssText =
            "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:10px 20px; background-color:red; color:white; border-radius:5px; z-index:1000;";
          document.body.appendChild(messageBox);
          setTimeout(() => {
            document.body.removeChild(messageBox);
          }, 3000);
        });
    } else {
      console.error("Preview panel not found or html2canvas not loaded.");
      const messageBox = document.createElement("div");
      messageBox.textContent = "Could not initiate download. html2canvas might not be loaded.";
      messageBox.style.cssText =
        "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); padding:10px 20px; background-color:orange; color:white; border-radius:5px; z-index:1000;";
      document.body.appendChild(messageBox);
      setTimeout(() => {
        document.body.removeChild(messageBox);
      }, 3000);
    }
  }, []); // Dependencies for useCallback, if any, would go here. Currently none.

  const appStyle: CSSProperties = {
    display: "flex",
    fontFamily: "var(--font-momo), system-ui, arial, sans-serif",
    height: "100vh",
    overflow: "hidden", // Prevent whole page scroll
    backgroundColor: "#e9e9e9", // A light background for the app itself
  };

  const controlPanelContainerStyle: CSSProperties = {
    width: "380px", // Fixed width for control panel
    flexShrink: 0,
    backgroundColor: "#ffffff",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    height: "100vh", // Full height
    overflowY: "auto", // Scroll if content overflows
  };

  const previewAreaStyle: CSSProperties = {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    height: "100vh", // Full height
    overflow: "auto", // Scroll if preview is larger than area
  };

  return (
    <div style={appStyle}>
      <div style={controlPanelContainerStyle}>
        <ControlPanel
          colors={colors}
          onColorChange={handleColorChange}
          noiseOpacity={noiseOpacity}
          onNoiseOpacityChange={setNoiseOpacity}
          previewWidth={previewWidth}
          onPreviewWidthChange={setPreviewWidth}
          previewHeight={previewHeight}
          onPreviewHeightChange={setPreviewHeight}
          overlayText={overlayText}
          onOverlayTextChange={setOverlayText}
          overlayTextSize={overlayTextSize}
          onOverlayTextSizeChange={setOverlayTextSize}
          onDownload={handleDownload}
        />
      </div>
      <div style={previewAreaStyle}>
        <AbstractGradientBackground
          colors={colors}
          noiseOpacity={noiseOpacity}
          width={previewWidth}
          height={previewHeight}
          overlayText={overlayText}
          overlayTextSize={overlayTextSize}
        />
      </div>
    </div>
  );
};

export default GenerativeBackground;
