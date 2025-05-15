import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Palette */
    --burgundy-dark: #3A0519;
    --burgundy: #670D2F;
    --rose: #A53860;
    --pink: #EF88AD;

    /* Primary Colors */
    --primary-color: var(--rose);
    --primary-dark: var(--burgundy);
    --primary-light: var(--pink);
    --secondary-color: var(--burgundy-dark);
    --accent-color: var(--pink);

    /* Text Colors */
    --text-dark: #333333;
    --text-medium: #666666;
    --text-light: #999999;

    /* Background Colors */
    --bg-white: #ffffff;
    --bg-light: #f8f9fa;
    --bg-gray: #f1f1f1;

    /* Health Score Colors */
    --score-excellent: var(--rose);
    --score-good: #8BC34A;
    --score-moderate: #FFC107;
    --score-poor: var(--burgundy);
    --score-bad: #F44336;

    /* Gradient Backgrounds */
    --gradient-primary: linear-gradient(135deg, var(--rose) 0%, var(--burgundy) 100%);
    --gradient-light: linear-gradient(135deg, var(--pink) 0%, var(--rose) 100%);
    --gradient-dark: linear-gradient(135deg, var(--burgundy) 0%, var(--burgundy-dark) 100%);

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
    --bg-white: #121212;
    --bg-light: #1e1e1e;
    --bg-gray: #2c2c2c;

    /* Adjusted Palette for Dark Mode - Brighter colors for better visibility */
    --burgundy-dark-dm: #5A2539;
    --burgundy-dm: #8A2D4F;
    --rose-dm: #D25880;
    --pink-dm: #FFA8CD;

    /* Primary Colors (Dark Mode) */
    --primary-color: var(--pink-dm);
    --primary-dark: var(--rose-dm);
    --primary-light: #FFB8DD;

    /* Gradient Backgrounds (Dark Mode) */
    --gradient-primary: linear-gradient(135deg, var(--pink-dm) 0%, var(--rose-dm) 100%);
    --gradient-light: linear-gradient(135deg, #FFB8DD 0%, var(--pink-dm) 100%);
    --gradient-dark: linear-gradient(135deg, var(--rose-dm) 0%, var(--burgundy-dm) 100%);

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
