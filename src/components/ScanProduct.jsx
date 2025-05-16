import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faCamera,
  faBarcode,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import HealthScore from './HealthScore';
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
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      // For testing purposes, use a mock response
      // In production, this would be replaced with the actual API call
      setTimeout(() => {
        const mockResponse = {
          "extracted_nutrition": {
            "sugar_g": 22,
            "calories_kcal": 110,
            "vitamin_c_mg": 78,
            "has_preservatives": false
          },
          "suggested_healthier_juices": [
            {
              "name": "Orange Delight",
              "brand": "Tropicana",
              "sugar_g": 8.0,
              "calories_kcal": 36.0,
              "vitamin_c_mg": 50,
              "has_preservatives": true
            },
            {
              "name": "Classic Apple",
              "brand": "Minute Maid",
              "sugar_g": 20.0,
              "calories_kcal": 105.0,
              "vitamin_c_mg": 15,
              "has_preservatives": true
            }
          ],
          "suggestion_summary": "The healthiest alternative is *Orange Delight.\n\nHere's why:\n\n   *Lower Sugar:* It has significantly less sugar (8g) compared to the juice you uploaded (22g) and Classic Apple (20g). Less sugar is generally better for your health.\n*   *Lower Calories:* It also has fewer calories (36kcal) compared to your juice (110kcal) and Classic Apple (105kcal).\n"
        };

        console.log('Mock API response:', mockResponse);
        setAnalysisResult(mockResponse);
        setIsAnalyzing(false);
      }, 2000); // Simulate a 2-second API call

      /*
      // This is the actual API call code that would be used in production
      // Create FormData object
      const formData = new FormData();

      let originalFile;

      // For uploaded files, use the selected file directly
      if (selectedFile) {
        // Rename the file to 'originalFile' while keeping its type
        originalFile = new File([selectedFile], 'originalFile', { type: selectedFile.type });
        formData.append('file', originalFile);
        console.log('Sending uploaded file:', originalFile);
      }
      // For camera captures, we need to convert the data URL to a file
      else if (previewImage && previewImage.startsWith('data:image')) {
        // Extract the MIME type from the data URL
        const mimeType = previewImage.split(';')[0].split(':')[1];

        // Convert data URL to blob
        const byteString = atob(previewImage.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        originalFile = new File([blob], 'originalFile', { type: mimeType });

        formData.append('file', originalFile);
        console.log('Sending camera capture:', originalFile);
      } else {
        throw new Error('No image file available');
      }

      // Send the file directly to the /analyze endpoint using axios
      const response = await axios.post(
        '/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const apiResponse = response.data;

      // Log the response
      console.log('API response:', apiResponse);

      // If the response is already parsed JSON (from axios)
      if (apiResponse) {
        setAnalysisResult(apiResponse);
      } else {
        setError('Failed to analyze image: No data returned');
        console.error('API Error: No data returned');
      }
      */
    } catch (error) {
      console.error('Error analyzing product:', error);
      setError(error.message || 'Failed to analyze the product. Please try again.');
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
                onFileSelect={setSelectedFile}
                ref={fileInputRef}
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
              <h3>Nutrition Analysis</h3>
              <ResultContent>
                {/* Health Score */}
                {analysisResult.extracted_nutrition && (
                  <HealthScore nutrition={analysisResult.extracted_nutrition} />
                )}

                {/* Nutrition Facts Card */}
                <NutritionCard>
                  <NutritionCardHeader>
                    <NutritionCardTitle>Your Juice Nutrition Facts</NutritionCardTitle>
                  </NutritionCardHeader>
                  <NutritionCardBody>
                    {analysisResult.extracted_nutrition && (
                      <NutritionTable>
                        {Object.entries(analysisResult.extracted_nutrition).map(([key, value]) => (
                          <NutritionRow key={key}>
                            <NutritionLabel>
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </NutritionLabel>
                            <NutritionValue>
                              {typeof value === 'boolean'
                                ? (value ? 'Yes' : 'No')
                                : `${value}${key.includes('sugar') ? 'g' : key.includes('calories') ? 'kcal' : key.includes('vitamin') ? 'mg' : ''}`}
                            </NutritionValue>
                          </NutritionRow>
                        ))}
                      </NutritionTable>
                    )}
                  </NutritionCardBody>
                </NutritionCard>

                {/* Healthier Alternatives */}
                {analysisResult.suggested_healthier_juices && analysisResult.suggested_healthier_juices.length > 0 && (
                  <AlternativesSection>
                    <AlternativesTitle>Healthier Alternatives</AlternativesTitle>
                    <AlternativesGrid>
                      {analysisResult.suggested_healthier_juices.map((juice, index) => {
                        // Calculate health score for each alternative juice
                        const calculateHealthScore = (nutrition) => {
                          let score = 100;

                          // Sugar penalty
                          if (nutrition.sugar_g > 15) {
                            score -= (nutrition.sugar_g - 15) * 2;
                          }

                          // Calorie penalty
                          if (nutrition.calories_kcal > 100) {
                            score -= (nutrition.calories_kcal - 100) * 0.5;
                          }

                          // Vitamin C bonus/penalty
                          if (nutrition.vitamin_c_mg >= 50) {
                            score += 5;
                          } else if (nutrition.vitamin_c_mg < 20) {
                            score -= 5;
                          }

                          // Preservative penalty
                          if (nutrition.has_preservatives) {
                            score -= 10;
                          }

                          return Math.max(0, Math.min(100, Math.round(score)));
                        };

                        const score = calculateHealthScore(juice);

                        // Determine score category and color
                        let scoreColor, scoreCategory, scoreEmoji;
                        if (score >= 90) {
                          scoreColor = 'var(--score-excellent)';
                          scoreCategory = 'Excellent';
                          scoreEmoji = '🟢';
                        } else if (score >= 70) {
                          scoreColor = 'var(--score-good)';
                          scoreCategory = 'Good';
                          scoreEmoji = '🟡';
                        } else {
                          scoreColor = 'var(--score-poor)';
                          scoreCategory = 'Poor';
                          scoreEmoji = '🔴';
                        }

                        return (
                          <AlternativeCard key={index}>
                            <AlternativeCardHeader>
                              <AlternativeName>{juice.name}</AlternativeName>
                              <AlternativeBrand>{juice.brand}</AlternativeBrand>
                            </AlternativeCardHeader>
                            <AlternativeCardBody>
                              <AlternativeScoreBadge color={scoreColor}>
                                {scoreEmoji} Health Score: {score}/100
                              </AlternativeScoreBadge>
                              <AlternativeNutrition>
                                <NutritionItem>
                                  <NutritionItemLabel>Sugar:</NutritionItemLabel>
                                  <NutritionItemValue>{juice.sugar_g}g</NutritionItemValue>
                                </NutritionItem>
                                <NutritionItem>
                                  <NutritionItemLabel>Calories:</NutritionItemLabel>
                                  <NutritionItemValue>{juice.calories_kcal}kcal</NutritionItemValue>
                                </NutritionItem>
                                <NutritionItem>
                                  <NutritionItemLabel>Vitamin C:</NutritionItemLabel>
                                  <NutritionItemValue>{juice.vitamin_c_mg !== null ? `${juice.vitamin_c_mg}mg` : 'N/A'}</NutritionItemValue>
                                </NutritionItem>
                                <NutritionItem>
                                  <NutritionItemLabel>Preservatives:</NutritionItemLabel>
                                  <NutritionItemValue>{juice.has_preservatives ? 'Yes' : 'No'}</NutritionItemValue>
                                </NutritionItem>
                              </AlternativeNutrition>
                            </AlternativeCardBody>
                          </AlternativeCard>
                        );
                      })}
                    </AlternativesGrid>
                  </AlternativesSection>
                )}

                {/* Suggestion Summary */}
                {analysisResult.suggestion_summary && (
                  <SummarySection>
                    <SummaryTitle>Recommendation</SummaryTitle>
                    <SummaryContent>
                      {analysisResult.suggestion_summary.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? <SummaryParagraph key={index}>{paragraph}</SummaryParagraph> : null
                      ))}
                    </SummaryContent>
                  </SummarySection>
                )}
              </ResultContent>
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
  margin-top: 30px;
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  h3 {
    margin-bottom: 15px;
    color: var(--primary-color);
    font-size: 1.5rem;
    text-align: center;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background-color: var(--primary-color);
    }
  }

  pre {
    background-color: var(--bg-white);
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    font-size: 0.9rem;
    color: var(--text-dark);
  }
`;

const ResultContent = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

// Nutrition Card Styles
const NutritionCard = styled.div`
  background-color: var(--bg-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const NutritionCardHeader = styled.div`
  background: var(--gradient-primary);
  padding: 15px 20px;
  color: white;
`;

const NutritionCardTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const NutritionCardBody = styled.div`
  padding: 20px;
`;

const NutritionTable = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const NutritionRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const NutritionLabel = styled.div`
  font-weight: 500;
  color: var(--text-dark);
`;

const NutritionValue = styled.div`
  font-weight: 600;
  color: var(--primary-color);
`;

// Alternatives Section Styles
const AlternativesSection = styled.div`
  margin-top: 10px;
`;

const AlternativesTitle = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-dark);
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--primary-color);
  }
`;

const AlternativesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const AlternativeCard = styled.div`
  background-color: var(--bg-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const AlternativeCardHeader = styled.div`
  background: var(--gradient-light);
  padding: 15px 20px;
  color: white;
`;

const AlternativeName = styled.h5`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const AlternativeBrand = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const AlternativeCardBody = styled.div`
  padding: 20px;
`;

const AlternativeScoreBadge = styled.div`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  background-color: ${props => props.color};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const AlternativeNutrition = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const NutritionItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const NutritionItemLabel = styled.span`
  font-size: 0.8rem;
  color: var(--text-medium);
  margin-bottom: 5px;
`;

const NutritionItemValue = styled.span`
  font-weight: 600;
  color: var(--primary-color);
  font-size: 1rem;
`;

// Summary Section Styles
const SummarySection = styled.div`
  background-color: var(--bg-white);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  border-left: 4px solid var(--primary-color);
`;

const SummaryTitle = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: var(--text-dark);
`;

const SummaryContent = styled.div`
  color: var(--text-medium);
`;

const SummaryParagraph = styled.p`
  margin-bottom: 15px;
  line-height: 1.6;

  &:last-child {
    margin-bottom: 0;
  }

  strong, b {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

export default ScanProduct;
