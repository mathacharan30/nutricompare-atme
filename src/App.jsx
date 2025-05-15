import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FeaturesPage from './pages/Features';
import ScanPage from './pages/Scan';
import HowItWorksPage from './pages/HowItWorks';
import ChatbotPage from './pages/ChatbotPage';
import TestComponent from './components/TestComponent';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestComponent />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </MainContent>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

// Styled Components
const MainContent = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  display: block;
  position: relative;
`;

export default App;
