import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../styles/ButtonStyles';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <NavbarContainer scrolled={scrolled}>
      <div className="container">
        <NavbarContent>
          <Logo to="/">
            Nutri<LogoSpan>Compare</LogoSpan>
          </Logo>

          <MobileMenuButton onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </MobileMenuButton>

          <NavLinks className={menuOpen ? 'active' : ''}>
            <NavItem>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/features" onClick={() => setMenuOpen(false)}>Features</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/scan" onClick={() => setMenuOpen(false)}>Scan Product</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/chatbot" onClick={() => setMenuOpen(false)}>Nutrition Chat</NavLink>
            </NavItem>
            <NavItem>
              <LoginButton to="/login" onClick={() => setMenuOpen(false)}>Login</LoginButton>
            </NavItem>
            <NavItem>
              <ThemeToggle
                onClick={(e) => {
                  e.preventDefault();
                  toggleTheme();
                  setMenuOpen(false);
                }}
                isDark={theme === 'dark'}
                aria-label="Toggle dark mode"
              >
                <FontAwesomeIcon icon={faMoon} className="moon-icon" />
                <FontAwesomeIcon icon={faSun} className="sun-icon" />
                <span className="visually-hidden">Toggle Dark Mode</span>
              </ThemeToggle>
            </NavItem>
          </NavLinks>
        </NavbarContent>
      </div>
    </NavbarContainer>
  );
};

// Styled Components
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${props => props.scrolled ? 'rgba(14, 27, 33, 0.95)' : 'rgba(14, 27, 33, 0.8)'};
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 1px 5px rgba(0, 0, 0, 0.2)'};
  padding: ${props => props.scrolled ? '10px 0' : '15px 0'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border-bottom: ${props => props.scrolled ? '1px solid rgba(159, 185, 203, 0.3)' : 'none'};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const LogoSpan = styled.span`
  color: var(--light-blue);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: -100%;
    width: 70%;
    height: calc(100vh - 60px);
    flex-direction: column;
    background-color: var(--dark-blue);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
    padding: 2rem;
    transition: right 0.3s ease;
    align-items: flex-start;
    border-left: 1px solid rgba(159, 185, 203, 0.2);

    &.active {
      right: 0;
    }
  }
`;

const NavItem = styled.li`
  margin: 0 0.5rem;

  @media (max-width: 768px) {
    margin: 1rem 0;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-medium);
  font-weight: 500;
  padding: 8px 15px;
  transition: var(--transition);
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover, &.active {
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    display: block;
    padding: 10px 0;
    color: var(--text-medium);
  }
`;

const LoginButton = styled(Link)`
  background-color: transparent;
  border: 2px solid var(--light-blue);
  color: var(--light-blue);
  padding: 8px 20px;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: var(--light-blue);
    color: var(--very-dark-blue);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    display: block;
  }
`;

export default Navbar;
