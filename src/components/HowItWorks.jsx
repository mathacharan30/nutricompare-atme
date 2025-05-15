import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const HowItWorks = () => {
  const stepsRef = useRef([]);

  // Add animation on scroll
  useEffect(() => {
    const steps = stepsRef.current;

    const handleScroll = () => {
      steps.forEach((step, index) => {
        if (step) {
          const rect = step.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;

          if (isVisible) {
            step.classList.add('animate');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Steps data
  const stepsData = [
    {
      number: 1,
      title: "Scan or Upload",
      description: "Take a photo of any food product, upload an image, or scan the barcode."
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our AI analyzes the product, extracts nutritional information, and evaluates ingredients."
    },
    {
      number: 3,
      title: "Health Scoring",
      description: "Machine learning algorithms calculate a comprehensive health score based on multiple factors."
    },
    {
      number: 4,
      title: "Find Alternatives",
      description: "We suggest healthier alternatives in the same product category based on your preferences."
    }
  ];

  return (
    <HowItWorksSection id="how-it-works">
      <div className="container">
        <SectionHeader className="text-center">
          <h2>How It Works</h2>
          <p>Our advanced technology makes nutritional analysis simple and accurate</p>
        </SectionHeader>

        <StepsContainer>
          {stepsData.map((step, index) => (
            <Step
              key={index}
              ref={el => stepsRef.current[index] = el}
              className={index % 2 === 0 ? 'from-left' : 'from-right'}
            >
              <StepNumber>{step.number}</StepNumber>
              <StepContent>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </StepContent>
            </Step>
          ))}
        </StepsContainer>
      </div>
    </HowItWorksSection>
  );
};

// Styled Components
const HowItWorksSection = styled.section`
  padding: 100px 0;
  background-color: var(--bg-white);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(239, 136, 173, 0.2) 0%, rgba(239, 136, 173, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(165, 56, 96, 0.15) 0%, rgba(165, 56, 96, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
`;

const StepsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(to bottom,
      rgba(165, 56, 96, 0.1) 0%,
      rgba(165, 56, 96, 0.5) 20%,
      rgba(165, 56, 96, 0.5) 80%,
      rgba(165, 56, 96, 0.1) 100%
    );
    transform: translateX(-50%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    &::before {
      left: 30px;
    }
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 80px;
  position: relative;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.from-right {
    flex-direction: row-reverse;
    transform: translateX(50px);

    @media (max-width: 768px) {
      flex-direction: row;
      transform: translateX(-50px);
    }
  }

  &.animate {
    opacity: 1;
    transform: translateX(0);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: row !important;
    margin-bottom: 50px;
  }
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(165, 56, 96, 0.3);
  position: relative;
  z-index: 2;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(239, 136, 173, 0.5) 0%, rgba(165, 56, 96, 0.5) 100%);
    z-index: -1;
    opacity: 0.5;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    margin-right: 20px;
  }
`;

const StepContent = styled.div`
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--box-shadow);
  flex: 1;
  margin: 0 30px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 30px;
    width: 20px;
    height: 20px;
    background-color: var(--bg-light);
    transform: rotate(45deg);
  }

  ${Step}.from-left &::before {
    left: -10px;
  }

  ${Step}.from-right &::before {
    right: -10px;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--primary-dark);
  }

  p {
    color: var(--text-medium);
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin: 0;
    margin-left: 20px;
    padding: 20px;

    &::before {
      left: -10px !important;
      right: auto !important;
    }
  }
`;

export default HowItWorks;
