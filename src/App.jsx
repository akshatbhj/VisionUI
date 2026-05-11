import { useState } from "react";
import CameraScanner from "./components/CameraScanner";
import { generateUISchema, applyThemeToUI } from "./services/api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function App() {
  const [sketchImage, setSketchImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedUI, setGeneratedUI] = useState(null);
  const [themeInput, setThemeInput] = useState("");
  const [isTheming, setIsTheming] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.65);

  const handleImageCapture = async (base64Image) => {
    setSketchImage(base64Image);
    setIsProcessing(true);
    setGeneratedUI(null);

    const uiSchema = await generateUISchema(base64Image);

    setGeneratedUI(uiSchema);
    setIsProcessing(false);
  };

  const handleThemeSubmit = async () => {
    if (!themeInput.trim() || !generatedUI) return;
    setIsTheming(true);

    try {
      const updatedUI = await applyThemeToUI(generatedUI.html, themeInput);
      if (updatedUI.html === generatedUI.html) {
        alert(
          "The AI server is currently overloaded. Please wait a few seconds and try again!",
        );
      } else {
        setGeneratedUI(updatedUI);
      }
    } catch (error) {
      alert("Something went wrong communicating with the AI.");
      console.log(error);
    } finally {
      setIsTheming(false);
      setThemeInput("");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>VisionUI</h1>
        <p>Upload or snap a photo of a UI sketch to generate code.</p>
      </header>

      {/* --- TOP ROW: Split View --- */}
      <div className="content-grid">
        {/* LEFT COLUMN: Input */}
        <div className="input-column">
          <CameraScanner onImageCaptured={handleImageCapture} />

          {isProcessing && (
            <div className="loading-message">
              <p>🤖 AI is analyzing your sketch. Please wait...</p>
            </div>
          )}

          {sketchImage && (
            <div className="debug-success">
              <p>✅ Image saved! Length: {sketchImage.length} chars.</p>
            </div>
          )}
        </div>

        <div className="transition-arrow">
          <svg
            width="140"
            height="80"
            viewBox="0 0 140 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 10,50 C 40,20 90,20 120,50" strokeDasharray="6 6" />

            <path d="M 105,45 L 120,50 L 115,35" />
          </svg>
        </div>

        {/* RIGHT COLUMN: Output (Live Preview) */}
        <div className="output-column">
          {generatedUI && generatedUI.html ? (
            <div className="preview-card">
              <div className="preview-header">
                <span>🌐 Live Preview</span>
                {/* NEW: Zoom Controls */}
                <div className="zoom-controls">
                  <label>{Math.round(zoomLevel * 100)}%</label>
                  <input
                    type="range"
                    min="0.25"
                    max="1.5"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="zoom-slider"
                  />
                </div>
              </div>

              <div className="theming-chatbar-container">
                <input
                  type="text"
                  value={themeInput}
                  onChange={(e) => setThemeInput(e.target.value)}
                  placeholder="e.g., 'Make it dark mode cyberpunk'..."
                  onKeyDown={(e) => e.key === "Enter" && handleThemeSubmit()}
                  disabled={isTheming}
                  className="theming-chatbar"
                />
                <button
                  onClick={handleThemeSubmit}
                  disabled={isTheming || !themeInput.trim()}
                  className="reskin-button"
                >
                  {isTheming ? "🎨 Painting..." : "✨ Reskin"}
                </button>
              </div>

              {/* NEW: Iframe wrapped for CSS scaling */}
              <div className="iframe-wrapper">
                <iframe
                  srcDoc={generatedUI.html}
                  title="Generated UI"
                  className="preview-iframe"
                  sandbox="allow-scripts"
                  style={{
                    width: `${100 / zoomLevel}%`,
                    height: `${100 / zoomLevel}%`,
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "0 0",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <p>Your generated UI will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM ROW: Code Section --- */}
      {generatedUI && generatedUI.html && (
        <div className="code-section">
          <div className="code-card">
            <div className="code-header">
              <span className="code-title">💻 Component Code</span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedUI.html)}
                className="copy-button"
              >
                Copy Code
              </button>
            </div>
            <div className="code-textarea">
              <SyntaxHighlighter
                language="html"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "15px",
                  background: "transparent",
                }}
                wrapLines={true}
                wrapLongLines={true}
                showLineNumbers={true}
              >
                {generatedUI.html.replace(/></g, ">\n<")}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
