import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faCamera,
  faBarcode,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { fetchData } from '../services/api';
import ImageUpload from './ImageUpload';

const ScanProduct = () => {
  const [activeMethod, setActiveMethod] = useState('upload');
  const [previewImage, setPreviewImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const cameraFeedRef = useRef(null);
  const cameraCanvasRef = useRef(null);
  const barcodeFeedRef = useRef(null);
  const scanOptionsRef = useRef([]);

  // Handle scan method change
  const changeMethod = (method) => {
    setActiveMethod(method);

    // Stop any active camera streams when switching methods
    if (cameraFeedRef.current && cameraFeedRef.current.srcObject) {
      const stream = cameraFeedRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Initialize camera if selected
    if (method === 'camera') {
      initCamera();
    }

    // Initialize barcode scanner if selected
    if (method === 'barcode') {
      initBarcodeScanner();
    }
  };

  // Initialize camera
  const initCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (cameraFeedRef.current) {
            cameraFeedRef.current.srcObject = stream;
            cameraFeedRef.current.play();
          }
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
          alert('Could not access camera. Please check permissions.');
        });
    } else {
      alert('Your browser does not support camera access.');
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (cameraFeedRef.current && cameraCanvasRef.current) {
      const context = cameraCanvasRef.current.getContext('2d');
      cameraCanvasRef.current.width = cameraFeedRef.current.videoWidth;
      cameraCanvasRef.current.height = cameraFeedRef.current.videoHeight;
      context.drawImage(cameraFeedRef.current, 0, 0, cameraCanvasRef.current.width, cameraCanvasRef.current.height);

      const imageData = cameraCanvasRef.current.toDataURL('image/png');
      setPreviewImage(imageData);

      // Stop camera stream
      const stream = cameraFeedRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  // Initialize barcode scanner
  const initBarcodeScanner = () => {
    // This would use a barcode scanning library like Quagga.js
    // For this example, we'll just simulate the functionality
    console.log('Barcode scanner initialized');
  };

  // Add 3D tilt effect to scan options
  useEffect(() => {
    const options = scanOptionsRef.current;

    options.forEach(option => {
      if (option) {
        option.addEventListener('mousemove', e => {
          const rect = option.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const deltaX = (x - centerX) / centerX;
          const deltaY = (y - centerY) / centerY;

          const tiltX = deltaY * 8;
          const tiltY = -deltaX * 8;

          option.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;

          // Move icon based on mouse position
          const icon = option.querySelector('i');
          if (icon) {
            icon.style.transform = `translateZ(25px) translateX(${deltaX * 5}px) translateY(${deltaY * 5}px)`;
          }
        });

        option.addEventListener('mouseleave', () => {
          if (option.classList.contains('active')) {
            option.style.transform = 'translateY(-5px) scale(1.05)';
          } else {
            option.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
          }

          const icon = option.querySelector('i');
          if (icon) {
            if (option.classList.contains('active')) {
              icon.style.transform = 'translateZ(40px) scale(1.3)';
            } else {
              icon.style.transform = 'translateZ(20px)';
            }
          }
        });
      }
    });

    return () => {
      options.forEach(option => {
        if (option) {
          option.removeEventListener('mousemove', () => { });
          option.removeEventListener('mouseleave', () => { });
        }
      });
    };
  }, []);

  // Analyze product
  const analyzeProduct = async () => {
    if (!previewImage && activeMethod !== 'barcode') {
      alert('Please upload or capture an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Create FormData object
      const formData = new FormData();

      // Convert base64 to blob
      const base64Data = previewImage.split(',')[1]; // Remove the data URL prefix
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Append the file to FormData
      formData.append('file', file);

      console.log('Sending request with file:', file);

      const apiResponse = await fetchData(formData);

      // Log the raw response object
      console.log('Raw response:', apiResponse);

      // Try to parse JSON (for both error and success)
      let respJson = null;
      try {
        respJson = await apiResponse.clone().json();
        console.log('Parsed JSON response:', respJson);
      } catch (jsonErr) {
        console.log('Response is not valid JSON:', jsonErr);
      }

      if (!apiResponse.ok) {
        setError(respJson?.message || 'Failed to analyze image');
        console.error('API Error Response:', respJson);
        return;
      }

      setAnalysisResult(respJson);
    } catch (error) {
      console.error('Error analyzing product:', error);
      setError(error.message || 'Failed to analyze the product. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScanSection id="scan">
      <div className="container">
        <SectionHeader className="text-center">
          <h2>Scan Your Product</h2>
          <p>Upload a food product image or scan a barcode to get detailed nutritional information</p>
        </SectionHeader>

        <ScanContainer>
          <ScanOptions>
            <ScanOption
              className={activeMethod === 'upload' ? 'active' : ''}
              onClick={() => changeMethod('upload')}
              ref={el => scanOptionsRef.current[0] = el}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Upload Image</span>
            </ScanOption>
            <ScanOption
              className={activeMethod === 'camera' ? 'active' : ''}
              onClick={() => changeMethod('camera')}
              ref={el => scanOptionsRef.current[1] = el}
            >
              <FontAwesomeIcon icon={faCamera} />
              <span>Take Photo</span>
            </ScanOption>
            <ScanOption
              className={activeMethod === 'barcode' ? 'active' : ''}
              onClick={() => changeMethod('barcode')}
              ref={el => scanOptionsRef.current[2] = el}
            >
              <FontAwesomeIcon icon={faBarcode} />
              <span>Scan Barcode</span>
            </ScanOption>
          </ScanOptions>

          <ScanInterface>
            {/* Upload Interface */}
            {activeMethod === 'upload' && (
              <ImageUpload
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
              />
            )}

            {/* Camera Interface */}
            {activeMethod === 'camera' && (
              <ScanMethod>
                <CameraContainer>
                  {!previewImage ? (
                    <>
                      <video ref={cameraFeedRef} autoPlay playsInline></video>
                      <CameraOverlay>
                        <CameraFrame></CameraFrame>
                      </CameraOverlay>
                      <CaptureButton onClick={captureImage}>
                        <FontAwesomeIcon icon={faCamera} />
                      </CaptureButton>
                    </>
                  ) : (
                    <PreviewContainer>
                      <img src={previewImage} alt="Captured" />
                      <button
                        className="remove-preview"
                        onClick={() => {
                          setPreviewImage(null);
                          initCamera();
                        }}
                      >
                        ×
                      </button>
                    </PreviewContainer>
                  )}
                  <canvas ref={cameraCanvasRef} className="hidden"></canvas>
                </CameraContainer>
              </ScanMethod>
            )}

            {/* Barcode Interface */}
            {activeMethod === 'barcode' && (
              <ScanMethod>
                <BarcodeContainer>
                  <video ref={barcodeFeedRef} autoPlay playsInline></video>
                  <BarcodeOverlay>
                    <BarcodeFrame></BarcodeFrame>
                  </BarcodeOverlay>
                  <BarcodeInstruction>Position the barcode within the frame</BarcodeInstruction>
                </BarcodeContainer>
              </ScanMethod>
            )}
          </ScanInterface>

          <AnalyzeButton
            onClick={analyzeProduct}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Product
                <FontAwesomeIcon icon={faPaperPlane} />
              </>
            )}
          </AnalyzeButton>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {analysisResult && (
            <ResultContainer>
              <h3>Analysis Results</h3>
              <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
            </ResultContainer>
          )}
        </ScanContainer>
      </div>
    </ScanSection>
  );
};

// Styled Components
const ScanSection = styled.section`
  padding: 100px 0;
  background-color: var(--bg-light);
  position: relative;
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
  }

  h2:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: var(--primary-color);
  }

  p {
    font-size: 1.1rem;
    color: var(--text-medium);
    max-width: 700px;
    margin: 0 auto;
  }
`;

const ScanContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(239, 136, 173, 0.3) 0%, rgba(239, 136, 173, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(165, 56, 96, 0.2) 0%, rgba(165, 56, 96, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const ScanOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ScanOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 15px;
  background-color: var(--bg-light);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(239, 136, 173, 0.2) 0%, rgba(165, 56, 96, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(165, 56, 96, 0.2);
  }

  &:hover::before {
    opacity: 1;
  }

  &.active {
    background: var(--gradient-light);
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 25px rgba(165, 56, 96, 0.3);
  }

  &.active svg {
    color: white;
    transform: scale(1.3);
  }

  svg {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  span {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-medium);
    transition: all 0.3s ease;
  }

  &.active span {
    color: white;
  }

  [data-theme="dark"] & {
    background-color: var(--bg-light);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  [data-theme="dark"] &.active {
    background: var(--gradient-light);
  }
`;

const ScanInterface = styled.div`
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
  min-height: 300px;
`;

const ScanMethod = styled.div`
  width: 100%;
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: #000;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CameraFrame = styled.div`
  width: 80%;
  height: 80%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
`;

const CaptureButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: 3px solid white;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: var(--primary-dark);
    transform: translateX(-50%) scale(1.1);
  }
`;

const BarcodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: var(--border-radius);
  overflow: hidden;
  background-color: #000;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BarcodeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BarcodeFrame = styled.div`
  width: 80%;
  height: 30%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
`;

const BarcodeInstruction = styled.p`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const AnalyzeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient-dark);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(165, 56, 96, 0.4);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg, span {
    position: relative;
    z-index: 1;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 10px;

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: var(--border-radius);
  text-align: center;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  h3 {
    margin-bottom: 15px;
    color: var(--text-dark);
  }

  pre {
    background-color: white;
    padding: 15px;
    border-radius: var(--border-radius);
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

export default ScanProduct;
