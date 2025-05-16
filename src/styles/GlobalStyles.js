import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Palette - Purple Theme */
    --purple: #7A257C;
    --dark-purple: #461F3F;
    --black: #000000;
    --light-gray: #F0F0F0;
    --white: #FFFFFF;

    /* Primary Colors */
    --primary-color: var(--purple);
    --primary-dark: var(--dark-purple);
    --primary-light: #9A4A9C;
    --secondary-color: var(--dark-purple);
    --accent-color: var(--light-gray);

    /* Text Colors */
    --text-dark: #000000;
    --text-medium: #333333;
    --text-light: #666666;

    /* Background Colors */
    --bg-white: #F0F0F0;
    --bg-light: #E0E0E0;
    --bg-gray: #CCCCCC;

    /* Health Score Colors */
    --score-excellent: var(--purple);
    --score-good: #8BC34A;
    --score-moderate: #FFC107;
    --score-poor: var(--dark-purple);
    --score-bad: #F44336;

    /* Gradient Backgrounds */
    --gradient-primary: linear-gradient(135deg, var(--purple) 0%, var(--dark-purple) 100%);
    --gradient-light: linear-gradient(135deg, #9A4A9C 0%, var(--purple) 100%);
    --gradient-dark: linear-gradient(135deg, var(--dark-purple) 0%, var(--black) 100%);

    /* Other */
    --border-radius: 8px;
    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }

  /* Dark Theme Variables */
  [data-theme="dark"] {
    /* Text Colors - Improved for better visibility */
    --text-dark: #ffffff;
    --text-medium: #e0e0e0;
    --text-light: #b0b0b0;

    /* Background Colors - Adjusted for better contrast */
    --bg-white: #000000;
    --bg-light: #1A1A1A;
    --bg-gray: #2A2A2A;

    /* Adjusted Palette for Dark Mode - Brighter colors for better visibility */
    --purple-dm: #7A257C;
    --dark-purple-dm: #461F3F;
    --black-dm: #000000;
    --light-gray-dm: #F0F0F0;
    --white-dm: #FFFFFF;

    /* Primary Colors (Dark Mode) */
    --primary-color: var(--purple-dm);
    --primary-dark: var(--black-dm);
    --primary-light: #9A4A9C;

    /* Gradient Backgrounds (Dark Mode) */
    --gradient-primary: linear-gradient(135deg, var(--purple-dm) 0%, var(--dark-purple-dm) 100%);
    --gradient-light: linear-gradient(135deg, #9A4A9C 0%, var(--purple-dm) 100%);
    --gradient-dark: linear-gradient(135deg, var(--dark-purple-dm) 0%, var(--black-dm) 100%);

    /* Box Shadow for Dark Mode */
    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-dark);
    background-color: var(--bg-white);
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100%;
    display: block;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-medium);
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: var(--transition);
  }

  a:hover {
    color: var(--primary-dark);
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Theme Transition Animation */
  .theme-transition {
    animation: theme-fade 1s ease;
  }

  @keyframes theme-fade {
    0% {
      opacity: 1;
    }
    10% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }

  /* Utility Classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .section {
    padding: 5rem 0;
  }

  .text-center {
    text-align: center;
  }

  .hidden {
    display: none !important;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    white-space: nowrap;
  }

  /* Section Header Styles */
  .section-header {
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
  }

  .section-header h2:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: var(--primary-color);
  }

  .section-header p {
    font-size: 1.1rem;
    color: var(--text-medium);
    max-width: 700px;
    margin: 0 auto;
  }

  /* Shape Divider */
  .shape-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  .shape-divider svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 60px;
  }

  .shape-divider .shape-fill {
    fill: var(--bg-white);
  }
`;

export default GlobalStyles;
