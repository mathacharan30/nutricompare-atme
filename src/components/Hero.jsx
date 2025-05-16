import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton, OutlineButton } from '../styles/ButtonStyles';
import heroImage from '../assets/images/new/hero-image-pink.svg';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <HeroSection id="home">
      <div className="container">
        <HeroContent>
          <HeroTextContent data-aos="fade-right" data-aos-delay="100">
            <HeroTitle data-aos="fade-up" data-aos-delay="200">{t('hero.title')}</HeroTitle>
            <HeroDescription data-aos="fade-up" data-aos-delay="300">
              {t('hero.subtitle')}
            </HeroDescription>
            <HeroButtons data-aos="fade-up" data-aos-delay="400">
              <PrimaryButton as={Link} to="/scan">{t('hero.cta_primary')}</PrimaryButton>
              <OutlineButton as={Link} to="/features">{t('hero.cta_secondary')}</OutlineButton>
            </HeroButtons>
          </HeroTextContent>
          <HeroImageContainer data-aos="fade-left" data-aos-delay="300">
            <HeroImg src={heroImage} alt="Food product scanning illustration" />
          </HeroImageContainer>
        </HeroContent>
      </div>
      <ShapeDivider>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </ShapeDivider>
    </HeroSection>
  );
};

// Styled Components
const HeroSection = styled.section`
  padding: 150px 0 100px;
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(122, 37, 124, 0.3) 0%, rgba(122, 37, 124, 0) 70%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -30%;
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, rgba(70, 31, 63, 0.3) 0%, rgba(70, 31, 63, 0) 70%);
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroTextContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  position: relative;
  display: inline-block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 4px;
    background: var(--gradient-light);
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 992px) {
    font-size: 2.8rem;

    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 576px) {
    font-size: 2.2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--text-medium);
  max-width: 90%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  strong {
    color: var(--primary-light);
    font-weight: 600;
  }

  @media (max-width: 992px) {
    margin: 0 auto 2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 15px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -30px;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(122, 37, 124, 0.4) 0%, rgba(122, 37, 124, 0) 70%);
    border-radius: 50%;
    z-index: -1;
  }

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 80%;
    height: 80%;
    background: var(--gradient-primary);
    opacity: 0.1;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    z-index: -1;
    animation: morphing 15s ease-in-out infinite;
  }

  @keyframes morphing {
    0% {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
    25% {
      border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
    }
    50% {
      border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
    }
    75% {
      border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
    }
    100% {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }
  }
`;

const HeroImg = styled.img`
  max-width: 100%;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 15px rgba(122, 37, 124, 0.4));

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const ShapeDivider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;

  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 80px;
  }

  .shape-fill {
    fill: var(--bg-light);
  }
`;

export default Hero;
