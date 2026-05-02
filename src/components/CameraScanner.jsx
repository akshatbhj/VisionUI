import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RefreshCcw } from "lucide-react";

const CameraScanner = ({ onImageCaptured }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(true);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    if (onImageCaptured) onImageCaptured(imageSrc);
  }, [webcamRef, onImageCaptured]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        if (onImageCaptured) onImageCaptured(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  return (
    <div className="scanner-container">
      
      {/* Top Controls */}
      <div className="controls-container">
        <button onClick={() => setIsWebcamActive(true)} className="control-btn">
          <Camera size={18} /> Use Camera
        </button>
        
        <button onClick={() => { setIsWebcamActive(false); fileInputRef.current.click(); }} className="control-btn">
          <Upload size={18} /> Upload Image
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden-input"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      {/* Main Display Area */}
      <div className="display-area">
        {capturedImage ? (
          <div>
            <img src={capturedImage} alt="Captured Sketch" className="captured-image" />
            <button onClick={() => setCapturedImage(null)} className="action-btn">
              <RefreshCcw size={18} /> Retake
            </button>
          </div>
        ) : isWebcamActive ? (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam-feed"
              onUserMediaError={(err) => console.error("Webcam Error:", err)}
            />
            <button onClick={capturePhoto} className="action-btn primary-btn">
              <Camera size={18} /> Capture Sketch
            </button>
          </div>
        ) : (
          <div className="placeholder-area">
            <Upload size={48} color="#ccc" />
            <p>Click "Upload Image" above to browse files.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScanner;