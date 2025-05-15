import React from 'react';
import styled from 'styled-components';

const TestComponent = () => {
  return (
    <TestContainer>
      <h1>Test Component</h1>
      <p>This is a test component to check if rendering works correctly.</p>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  padding: 100px 20px;
  background-color: #f0f0f0;
  text-align: center;
  min-height: 100vh;
`;

export default TestComponent;
