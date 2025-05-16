import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

const ImageUpload = React.forwardRef(({ previewImage, setPreviewImage, onFileSelect }, ref) => {
    const fileInputRef = useRef(null);
    const dropAreaRef = useRef(null);

    // Handle file upload
    const handleFileUpload = (files) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.match('image.*')) {
                // Store the original file for API upload
                if (onFileSelect) {
                    onFileSelect(file);
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = function (e) {
                    setPreviewImage(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file');
            }
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        handleFileUpload(e.target.files);
    };

    // Handle drag and drop
    useEffect(() => {
        const dropArea = dropAreaRef.current;

        if (dropArea) {
            const preventDefaults = (e) => {
                e.preventDefault();
                e.stopPropagation();
            };

            const highlight = () => {
                dropArea.classList.add('highlight');
            };

            const unhighlight = () => {
                dropArea.classList.remove('highlight');
            };

            const handleDrop = (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFileUpload(files);
            };

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unhighlight, false);
            });

            dropArea.addEventListener('drop', handleDrop, false);

            return () => {
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.removeEventListener(eventName, preventDefaults, false);
                });

                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.removeEventListener(eventName, highlight, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.removeEventListener(eventName, unhighlight, false);
                });

                dropArea.removeEventListener('drop', handleDrop, false);
            };
        }
    }, []);

    // Use the forwarded ref or the local ref
    const inputRef = ref || fileInputRef;

    // Effect to expose the file input to the parent component
    useEffect(() => {
        if (ref) {
            ref.current = fileInputRef.current;
        }
    }, [ref]);

    return (
        <ScanMethod>
            <UploadArea ref={dropAreaRef} className={previewImage ? 'has-preview' : ''}>
                {!previewImage ? (
                    <UploadForm>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            accept="image/*"
                            className="visually-hidden"
                        />
                        <UploadLabel onClick={() => fileInputRef.current.click()}>
                            <UploadPrompt>
                                <FontAwesomeIcon icon={faCloudUploadAlt} />
                                <p>Drag & drop your image here or click to browse</p>
                                <span className="small">Supported formats: JPG, PNG, JPEG</span>
                            </UploadPrompt>
                        </UploadLabel>
                    </UploadForm>
                ) : (
                    <PreviewContainer>
                        <img src={previewImage} alt="Preview" />
                        <button
                            className="remove-preview"
                            onClick={() => {
                                setPreviewImage(null);
                                if (onFileSelect) {
                                    onFileSelect(null);
                                }
                            }}
                        >
                            ×
                        </button>
                    </PreviewContainer>
                )}
            </UploadArea>
        </ScanMethod>
    );
});

// Styled Components
const ScanMethod = styled.div`
  width: 100%;
`;

const UploadArea = styled.div`
  border: 2px dashed var(--primary-light);
  border-radius: var(--border-radius);
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--bg-light);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.highlight {
    border-color: var(--primary-color);
    background-color: rgba(239, 136, 173, 0.1);
  }

  &.has-preview {
    border-style: solid;
    padding: 0;
    overflow: hidden;
  }
`;

const UploadForm = styled.form`
  width: 100%;
`;

const UploadLabel = styled.label`
  cursor: pointer;
  display: block;
  width: 100%;
`;

const UploadPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 3rem;
    color: var(--primary-light);
    margin-bottom: 15px;
  }

  p {
    font-size: 1.1rem;
    color: var(--text-medium);
    margin-bottom: 10px;
  }

  .small {
    font-size: 0.8rem;
    color: var(--text-light);
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-height: 300px;
  }

  .remove-preview {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }
  }
`;

export default ImageUpload;