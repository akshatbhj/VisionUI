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

  // This function receives the image from the CameraScanner component
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

      // If the API failed and returned the original HTML, tell the user
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

      <main>
        <CameraScanner onImageCaptured={handleImageCapture} />
      </main>

      {/* The Loading State */}
      {isProcessing && (
        <div className="loading-message">
          <p>🤖 AI is analyzing your sketch. Please wait...</p>
        </div>
      )}

      {/* The Output Section */}
      {generatedUI && generatedUI.html && (
        <div className="output-container">
          {/* 1. The Live Preview Window */}
          <div className="preview-card">
            <div className="preview-header">🌐 Live Preview</div>

            {/* --- THEMING CHAT BAR --- */}
            <div className="theming-chatbar-container" >
              <input
                type="text"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                placeholder="e.g., 'Make it dark mode cyberpunk' or 'Luxury minimalist'"
                onKeyDown={(e) => e.key === "Enter" && handleThemeSubmit()}
                disabled={isTheming}
                className="theming-chatbar"
              />
              <button
                onClick={handleThemeSubmit}
                disabled={isTheming || !themeInput.trim()}
                className="copy-button"
                style={{ backgroundColor: isTheming ? "#94a3b8" : "#8b5cf6" }}
              >
                {isTheming ? "🎨 Painting..." : "✨ Reskin"}
              </button>
            </div>

            <iframe
              srcDoc={generatedUI.html}
              title="Generated UI"
              className="preview-iframe"
              sandbox="allow-scripts"
            />
          </div>

          {/* 2. The Raw Code Export */}
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

      {/* Debug Message */}
      {sketchImage && (
        <div className="debug-success">
          <p>
            ✅ Image saved to state! Length: {sketchImage.length} characters.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;