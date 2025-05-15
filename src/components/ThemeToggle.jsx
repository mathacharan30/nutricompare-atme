import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle as StyledThemeToggle } from '../styles/ButtonStyles';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <StyledThemeToggle 
      onClick={(e) => {
        e.preventDefault();
        toggleTheme();
      }}
      isDark={theme === 'dark'}
      aria-label="Toggle dark mode"
    >
      <FontAwesomeIcon icon={faMoon} className="moon-icon" />
      <FontAwesomeIcon icon={faSun} className="sun-icon" />
      <span className="visually-hidden">Toggle Dark Mode</span>
    </StyledThemeToggle>
  );
};

export default ThemeToggle;
