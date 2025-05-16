import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get current language object
  const currentLangObj = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language change
  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <LanguageSwitcherContainer ref={dropdownRef}>
      <LanguageButton onClick={toggleDropdown}>
        <IconWrapper>
          <FontAwesomeIcon icon={faGlobe} />
        </IconWrapper>
        <CurrentLanguage>
          <span>{currentLangObj.flag}</span>
          <span className="lang-name">{t(`language.${currentLangObj.code}`)}</span>
        </CurrentLanguage>
        <ChevronIcon isOpen={isOpen}>
          <FontAwesomeIcon icon={faChevronDown} />
        </ChevronIcon>
      </LanguageButton>

      {isOpen && (
        <LanguageDropdown>
          <DropdownHeader>{t('language.language_selector')}</DropdownHeader>
          <LanguageList>
            {/* Group languages by region */}
            <LanguageGroup>
              {languages.filter(lang => ['en', 'es'].includes(lang.code)).map((language) => (
                <LanguageOption
                  key={language.code}
                  isActive={currentLanguage === language.code}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <LanguageFlag>{language.flag}</LanguageFlag>
                  <LanguageName>{t(`language.${language.code}`)}</LanguageName>
                </LanguageOption>
              ))}
            </LanguageGroup>

            {/* Indian Languages Group */}
            <LanguageGroupHeader>{t('language.indian_languages')}</LanguageGroupHeader>
            <LanguageGroup>
              {languages.filter(lang => ['hi', 'ta', 'bn'].includes(lang.code)).map((language) => (
                <LanguageOption
                  key={language.code}
                  isActive={currentLanguage === language.code}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <LanguageFlag>{language.flag}</LanguageFlag>
                  <LanguageName>{t(`language.${language.code}`)}</LanguageName>
                </LanguageOption>
              ))}
            </LanguageGroup>
          </LanguageList>
        </LanguageDropdown>
      )}
    </LanguageSwitcherContainer>
  );
};

// Styled Components
const LanguageSwitcherContainer = styled.div`
  position: relative;
  margin-left: 15px;
  z-index: 1000;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(122, 37, 124, 0.4);
  border-radius: 20px;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(122, 37, 124, 0.2);
  }

  @media (max-width: 768px) {
    padding: 6px 8px;

    .lang-name {
      display: none;
    }
  }
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const CurrentLanguage = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChevronIcon = styled.span`
  margin-left: 8px;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  font-size: 0.7rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--bg-white);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 200px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
  z-index: 1000;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  font-weight: 600;
  color: var(--text-dark);
  border-bottom: 1px solid var(--bg-light);
`;

const LanguageList = styled.div`
  max-height: 250px;
  overflow-y: auto;

  /* Custom scrollbar for better UX */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-light);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-light);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.isActive ? 'var(--bg-light)' : 'transparent'};

  &:hover {
    background-color: var(--bg-light);
  }
`;

const LanguageFlag = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
`;

const LanguageName = styled.span`
  color: var(--text-dark);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  /* Ensure proper rendering of complex scripts */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const LanguageGroup = styled.div`
  border-bottom: 1px solid var(--bg-light);

  &:last-child {
    border-bottom: none;
  }
`;

const LanguageGroupHeader = styled.div`
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary-color);
  background-color: var(--bg-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default LanguageSwitcher;
