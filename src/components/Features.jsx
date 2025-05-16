import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faRobot,
  faChartPie,
  faBrain,
  faExclamationTriangle,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();
  // Refs for feature cards to add 3D tilt effect
  const featureCardsRef = useRef([]);

  // Add 3D tilt effect to feature cards
  useEffect(() => {
    const cards = featureCardsRef.current;

    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const tiltX = deltaY * 10;
      const tiltY = -deltaX * 10;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;

      // Move icon based on mouse position
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = `translateZ(40px) translateX(${deltaX * 10}px) translateY(${deltaY * 10}px)`;
      }
    };

    const handleMouseLeave = (card) => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        icon.style.transform = 'translateZ(30px)';
      }
    };

    cards.forEach(card => {
      if (card) {
        card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.addEventListener('mouseleave', () => handleMouseLeave(card));
      }
    });

    return () => {
      cards.forEach(card => {
        if (card) {
          card.removeEventListener('mousemove', (e) => handleMouseMove(e, card));
          card.removeEventListener('mouseleave', () => handleMouseLeave(card));
        }
      });
    };
  }, []);

  // Feature data with translation keys
  const featuresData = [
    {
      icon: faCamera,
      titleKey: "features.feature1.title",
      descriptionKey: "features.feature1.description"
    },
    {
      icon: faRobot,
      titleKey: "features.feature2.title",
      descriptionKey: "features.feature2.description"
    },
    {
      icon: faChartPie,
      titleKey: "features.feature3.title",
      descriptionKey: "features.feature3.description"
    },
    {
      icon: faBrain,
      titleKey: "features.feature4.title",
      descriptionKey: "features.feature4.description"
    },
    {
      icon: faExclamationTriangle,
      titleKey: "features.feature5.title",
      descriptionKey: "features.feature5.description"
    },
    {
      icon: faThumbsUp,
      titleKey: "features.feature6.title",
      descriptionKey: "features.feature6.description"
    }
  ];

  return (
    <FeaturesSection id="features">
      <div className="container">
        <SectionHeader data-aos="fade-up">
          <h2 data-aos="fade-up" data-aos-delay="100">{t('features.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="200">{t('features.subtitle')}</p>
        </SectionHeader>

        <FeaturesGrid>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              ref={el => featureCardsRef.current[index] = el}
              data-aos="zoom-in-up"
              data-aos-delay={200 + (index * 100)}
              data-aos-duration="800"
            >
              <FeatureIcon className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </FeatureIcon>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descriptionKey)}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </div>
    </FeaturesSection>
  );
};

// Styled Components
const FeaturesSection = styled.section`
  padding: 100px 0;
  background-color: var(--bg-light);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(210, 88, 128, 0.2) 0%, rgba(210, 88, 128, 0) 70%);
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
    background: radial-gradient(circle, rgba(255, 168, 205, 0.15) 0%, rgba(255, 168, 205, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;

    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: var(--primary-color);
    }
  }

  p {
    font-size: 1.1rem;
    color: var(--text-medium);
    max-width: 700px;
    margin: 0 auto;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const FeatureCard = styled.div`
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  padding: 30px;
  text-align: center;
  box-shadow: var(--box-shadow);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transform-style: preserve-3d;
  perspective: 1000px;
  cursor: pointer;
  border: 1px solid rgba(255, 168, 205, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 168, 205, 0.2) 0%, rgba(210, 88, 128, 0.1) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    transform: translateY(-15px) rotateX(5deg) rotateY(-5deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 168, 205, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    transition: all 0.5s ease;
    transform: translateZ(20px);
    color: var(--text-dark);
  }

  &:hover h3 {
    transform: translateZ(40px);
    color: var(--primary-light);
  }

  p {
    color: var(--text-medium);
    font-size: 0.95rem;
    transition: all 0.5s ease;
    transform: translateZ(10px);
  }

  &:hover p {
    transform: translateZ(30px);
    color: var(--text-medium);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: rgba(255, 168, 205, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  transition: all 0.5s ease;
  position: relative;
  transform: translateZ(30px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 2px solid rgba(255, 168, 205, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent,
      transparent,
      transparent,
      var(--pink-dm)
    );
    animation: rotate 4s linear infinite;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  ${FeatureCard}:hover & {
    transform: translateZ(50px) scale(1.1);
    background: var(--gradient-light);
    border-color: rgba(255, 184, 221, 0.5);
  }

  ${FeatureCard}:hover &::before {
    opacity: 0.5;
  }

  ${FeatureCard}:hover &::after {
    opacity: 1;
  }

  svg {
    font-size: 32px;
    color: var(--primary-light);
    transition: all 0.5s ease;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }

  ${FeatureCard}:hover svg {
    color: white;
    transform: scale(1.2);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
  }
`;

export default Features;
