import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterAbout>
            <FooterLogo>
              Nutri<FooterLogoSpan>Compare</FooterLogoSpan>
            </FooterLogo>
            <p>
              Helping you make healthier food choices with advanced nutrition analysis 
              and personalized recommendations.
            </p>
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </SocialLink>
            </SocialLinks>
          </FooterAbout>

          <FooterLinksSection>
            <h4>Quick Links</h4>
            <FooterLinks>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/scan">Scan Product</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="/chatbot">Nutrition Chat</FooterLink>
            </FooterLinks>
          </FooterLinksSection>

          <FooterLinksSection>
            <h4>Support</h4>
            <FooterLinks>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </FooterLinks>
          </FooterLinksSection>

          <FooterNewsletter>
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest updates and nutrition tips.</p>
            <NewsletterForm>
              <NewsletterInput 
                type="email" 
                placeholder="Your email address" 
                aria-label="Email address"
              />
              <NewsletterButton type="submit" aria-label="Subscribe">
                <FontAwesomeIcon icon={faPaperPlane} />
              </NewsletterButton>
            </NewsletterForm>
          </FooterNewsletter>
        </FooterContent>
      </div>

      <FooterBottom>
        <div className="container">
          <p>&copy; {currentYear} NutriCompare. All rights reserved.</p>
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background: linear-gradient(to bottom, var(--burgundy-dark) 0%, #2c0a1a 100%);
  color: white;
  padding: 80px 0 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, var(--pink), var(--rose), var(--burgundy), var(--burgundy-dark));
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(165, 56, 96, 0.2) 0%, rgba(165, 56, 96, 0) 70%);
    pointer-events: none;
  }

  [data-theme="dark"] & {
    background: linear-gradient(to bottom, #1a0a12 0%, #0a0205 100%);
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 50px;
`;

const FooterAbout = styled.div`
  margin-bottom: 30px;

  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 20px;
  }
`;

const FooterLogo = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: white;
`;

const FooterLogoSpan = styled.span`
  color: var(--pink);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient-light);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(239, 136, 173, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover i {
    transform: scale(1.2);
  }

  i {
    transition: transform 0.3s ease;
  }
`;

const FooterLinksSection = styled.div`
  h4 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: white;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  transition: var(--transition);
  position: relative;
  display: inline-block;
  padding: 3px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--gradient-light);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s ease;
  }

  &:hover {
    color: var(--pink);
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const FooterNewsletter = styled.div`
  h4 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: white;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 20px;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 20px;
  position: relative;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: none;
  border-radius: 30px 0 0 30px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    background-color: white;
    box-shadow: inset 0 2px 5px rgba(165, 56, 96, 0.2);
  }

  [data-theme="dark"] & {
    background-color: var(--bg-gray);
    color: var(--text-dark);
  }
`;

const NewsletterButton = styled.button`
  width: 50px;
  height: 48px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
  }

  &:hover {
    transform: translateX(3px);
    box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  svg {
    position: relative;
    z-index: 1;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
`;

export default Footer;
