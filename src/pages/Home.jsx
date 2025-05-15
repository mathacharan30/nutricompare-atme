import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ScanProduct from '../components/ScanProduct';
import HowItWorks from '../components/HowItWorks';
import Chatbot from '../components/Chatbot';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <Features />
      <ScanProduct />
      <HowItWorks />
      <Chatbot />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: block;
`;

export default Home;
