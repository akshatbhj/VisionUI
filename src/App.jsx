import { useState } from "react";
import CameraScanner from "./components/CameraScanner";
import "./App.css";

function App() {
  const [sketchImage, setSketchImage] = useState(null);

  // This function receives the image from the CameraScanner component
  const handleImageCapture = (base64Image) => {
    setSketchImage(base64Image);
    console.log("Image successfully captured! Ready for AI processing.");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>👁️ VisionUI</h1>
        <p>Upload or snap a photo of a UI sketch to generate code.</p>
      </header>

      <main>
        <CameraScanner onImageCaptured={handleImageCapture} />
      </main>

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
