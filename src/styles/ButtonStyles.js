import styled, { css } from 'styled-components';

// Base Button Styles
export const Button = styled.button`
  display: inline-block;
  padding: 14px 32px;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: center;
  border: none;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  transform-style: preserve-3d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 152, 201, 0.2) 0%, rgba(255, 105, 180, 0.3) 100%);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s ease;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255, 255, 255, 0.5);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover {
    transform: translateY(-5px) translateZ(20px);
  }

  &:active {
    transform: translateY(-2px) translateZ(10px);
    transition: all 0.1s ease;
  }
`;

// Primary Button
export const PrimaryButton = styled(Button)`
  background: var(--gradient-primary);
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradient-dark);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: scaleX(1);
  }

  &:hover {
    color: white;
    box-shadow: 0 15px 25px rgba(255, 105, 180, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.2);
  }
`;

// Outline Button
export const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 2px solid var(--hot-pink);
  color: var(--hot-pink);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.1);

  &::before {
    background: linear-gradient(45deg, rgba(255, 152, 201, 0.1) 0%, rgba(255, 105, 180, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    transform: scaleX(1);
  }

  &:hover {
    color: var(--black);
    border-color: var(--black);
    box-shadow: 0 15px 25px rgba(255, 105, 180, 0.2);
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  }
`;

// Theme Toggle Button (Dark Mode Only)
export const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: default; /* Changed to default since theme toggle is disabled */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-left: 10px;
  background-color: var(--black-dm);
  box-shadow: inset 0 0 0 2px var(--hot-pink-dm), 0 0 10px rgba(255, 105, 180, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1000;

  &:hover {
    transform: scale(1.05);
  }

  .sun-icon {
    position: absolute;
    font-size: 1.2rem;
    color: var(--hot-pink-dm);
    opacity: 1;
    transform: translateY(0) rotate(0);
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
  }

  .moon-icon {
    font-size: 1.2rem;
    color: var(--hot-pink-dm);
    opacity: 0;
    transform: translateY(-20px) rotate(-90deg);
    transition: all 0.3s ease;
  }

  /* Always show dark mode styling */
  ${props => css`
    .sun-icon {
      opacity: 1;
      transform: translateY(0) rotate(0);
    }

    .moon-icon {
      opacity: 0;
      transform: translateY(-20px) rotate(-90deg);
    }
  `}
`;
