import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faCheckCircle,
  faPaperPlane,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import chatbotService from '../services/chatbotService';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize chat session when opened for the first time
  useEffect(() => {
    if (isChatOpen && !hasWelcomed) {
      initializeChat();
    }
  }, [isChatOpen, hasWelcomed]);

  // Initialize chat with welcome message
  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const session = await chatbotService.startSession();
      setSessionId(session.sessionId);

      // Add welcome message
      const welcomeMessage = {
        type: 'bot',
        text: session.message || "Hello! I'm CalQ Assistant, your personal nutrition assistant. How can I help you today?"
      };

      // Add typing indicator
      setMessages([{ type: 'typing' }]);

      // Simulate typing delay for a more natural feel
      setTimeout(() => {
        setMessages([welcomeMessage]);
        setHasWelcomed(true);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setMessages([{
        type: 'bot',
        text: "Hello! I'm CalQ Assistant, your personal nutrition assistant. How can I help you today?"
      }]);
      setHasWelcomed(true);
      setIsLoading(false);
    }
  };

  // Toggle chat modal
  const toggleChat = () => {
    const newState = !isChatOpen;
    setIsChatOpen(newState);

    // If closing the chat, reset session
    if (!newState && sessionId) {
      chatbotService.endSession(sessionId)
        .then(() => {
          console.log('Chat session ended');
        })
        .catch(error => {
          console.error('Error ending chat session:', error);
        });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim() === '' || isLoading) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue
    };

    const currentMessages = [...messages, userMessage];
    setMessages([...currentMessages, { type: 'typing' }]);

    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await chatbotService.sendMessage(userInput, sessionId);

      // Remove typing indicator and add bot response
      setTimeout(() => {
        setMessages(prev => {
          // Filter out typing indicator
          const filteredMessages = prev.filter(msg => msg.type !== 'typing');

          // Add bot response
          return [...filteredMessages, {
            type: 'bot',
            text: response.message
          }];
        });
        setIsLoading(false);
      }, 1000); // Simulate typing delay

    } catch (error) {
      console.error('Error sending message:', error);

      // Remove typing indicator and add error message
      setTimeout(() => {
        setMessages(prev => {
          // Filter out typing indicator
          const filteredMessages = prev.filter(msg => msg.type !== 'typing');

          // Add error message
          return [...filteredMessages, {
            type: 'bot',
            text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
          }];
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  // Chatbot features list
  const features = [
    "Get nutritional advice tailored to your needs",
    "Ask about ingredients and their effects",
    "Learn about dietary restrictions and alternatives",
    "Understand product health scores and comparisons"
  ];

  return (
    <>
      <ChatbotSection id="chatbot">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <ChatbotInfo data-aos="fade-right" data-aos-delay="100">
                <h2 data-aos="fade-up" data-aos-delay="200">Nutrition Assistant</h2>
                <p className="lead" data-aos="fade-up" data-aos-delay="300">Have questions about nutrition? Our AI-powered chatbot can help you with personalized advice and answers.</p>
                <ChatbotFeatures data-aos="fade-up" data-aos-delay="400">
                  {features.map((feature, index) => (
                    <li key={index} data-aos="fade-up" data-aos-delay={500 + (index * 100)}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {feature}
                    </li>
                  ))}
                </ChatbotFeatures>
                <ChatButton
                  data-aos="fade-up"
                  data-aos-delay="900"
                  onClick={() => {
                    // Reset chat state if it was previously opened
                    if (hasWelcomed) {
                      setMessages([]);
                      setHasWelcomed(false);
                      setSessionId(null);
                    }
                    toggleChat();
                  }}
                >
                  <span>Start Chatting</span>
                </ChatButton>
              </ChatbotInfo>
            </div>
            <div className="col-lg-6">
              <ChatbotPreview data-aos="fade-left" data-aos-delay="300">
                <ChatHeader data-aos="fade-down" data-aos-delay="400">
                  <ChatAvatar>
                    <FontAwesomeIcon icon={faRobot} />
                  </ChatAvatar>
                  <ChatTitle>
                    <h4>CalQ Assistant</h4>
                    <Status>Online</Status>
                  </ChatTitle>
                </ChatHeader>
                <ChatMessages>
                  <Message className="bot" data-aos="fade-right" data-aos-delay="500">
                    <p>Hello! I'm CalQ Assistant, your personal nutrition assistant. How can I help you today?</p>
                  </Message>
                  <Message className="user" data-aos="fade-left" data-aos-delay="600">
                    <p>Is orange juice healthier than soda?</p>
                  </Message>
                  <Message className="bot" data-aos="fade-right" data-aos-delay="700">
                    <p>While orange juice contains vitamins and minerals not found in soda, it's important to note that both can be high in sugar. A typical 8oz serving of orange juice contains about 21g of sugar, while the same amount of soda has about 26g.</p>
                  </Message>
                  <Message className="bot" data-aos="fade-right" data-aos-delay="800">
                    <p>For a healthier option, I'd recommend water with a splash of fresh orange juice or herbal tea. Would you like more specific comparisons?</p>
                  </Message>
                </ChatMessages>
                <ChatInputContainer data-aos="fade-up" data-aos-delay="900">
                  <input type="text" placeholder="Type your nutrition question..." disabled />
                  <button><FontAwesomeIcon icon={faPaperPlane} /></button>
                </ChatInputContainer>
              </ChatbotPreview>
            </div>
          </div>
        </div>
      </ChatbotSection>

      {/* Chat Modal */}
      <ChatModal className={isChatOpen ? 'open' : ''}>
        <ChatContainer>
          <ChatHeader>
            <ChatAvatar>
              <FontAwesomeIcon icon={faRobot} />
            </ChatAvatar>
            <ChatTitle>
              <h4>CalQ Assistant</h4>
              <Status>Online</Status>
            </ChatTitle>
            <CloseButton onClick={toggleChat}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </ChatHeader>
          <ChatBody ref={chatBodyRef}>
            {messages.map((message, index) => (
              message.type === 'typing' ? (
                <Message key={`typing-${index}`} className="bot typing">
                  <TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </TypingIndicator>
                </Message>
              ) : (
                <Message key={index} className={message.type}>
                  <p>{message.text}</p>
                </Message>
              )
            ))}
          </ChatBody>
          <form onSubmit={handleSubmit}>
            <ChatInputContainer>
              <input
                type="text"
                placeholder={isLoading ? "CalQ Assistant is typing..." : "Type your nutrition question..."}
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || inputValue.trim() === ''}>
                <FontAwesomeIcon icon={isLoading ? faSpinner : faPaperPlane} spin={isLoading} />
              </button>
            </ChatInputContainer>
          </form>
        </ChatContainer>
      </ChatModal>
    </>
  );
};

// Styled Components
const ChatbotSection = styled.section`
  padding: 100px 0;
  background-color: var(--bg-light);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(239, 136, 173, 0.3) 0%, rgba(239, 136, 173, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(165, 56, 96, 0.2) 0%, rgba(165, 56, 96, 0) 70%);
    border-radius: 50%;
    z-index: 0;
  }

  .row {
    position: relative;
    z-index: 1;
  }
`;

const ChatbotInfo = styled.div`
  padding-right: 30px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-dark); /* Changed from primary-dark to text-dark for better visibility in dark mode */
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 80px;
      height: 3px;
      background: var(--gradient-light);
      border-radius: 2px;
    }
  }

  .lead {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: var(--text-dark); /* Changed from text-medium to text-dark for better visibility in dark mode */
  }

  @media (max-width: 992px) {
    padding-right: 0;
    margin-bottom: 50px;
    text-align: center;

    h2::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const ChatbotFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;

  li {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    color: var(--text-dark); /* Changed from text-medium to text-dark for better visibility in dark mode */

    svg {
      color: var(--primary-color);
      margin-right: 15px;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 992px) {
    max-width: 400px;
    margin: 0 auto 2rem;
    text-align: left;
  }
`;

const ChatButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
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
    z-index: 0;
  }

  /* Add a span to ensure text is always visible */
  span {
    position: relative;
    z-index: 1;
    color: white; /* Ensure text is always white */
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(165, 56, 96, 0.4);
    color: white; /* Ensure text stays white on hover */
  }

  &:hover::before {
    opacity: 1;
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
  }

  @media (max-width: 992px) {
    margin: 0 auto;
    display: block;
  }
`;

const ChatbotPreview = styled.div`
  background-color: var(--bg-white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: all 0.5s ease;

  &:hover {
    transform: perspective(1000px) rotateY(0) rotateX(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(239, 136, 173, 0.1) 0%, rgba(165, 56, 96, 0.05) 100%);
    z-index: -1;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: var(--gradient-primary);
  color: white;
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;

  svg {
    color: var(--primary-color);
    font-size: 1.2rem;
  }
`;

const ChatTitle = styled.div`
  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Status = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  margin-bottom: 15px;
  max-width: 80%;

  p {
    margin: 0;
    padding: 12px 15px;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  &.bot {
    align-self: flex-start;

    p {
      background-color: white;
      color: #000000; /* Explicitly black text for bot messages */
      border-bottom-left-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      font-weight: 500; /* Slightly bolder for better readability */
    }
  }

  &.user {
    align-self: flex-end;

    p {
      background: var(--gradient-primary);
      color: white; /* White text for user messages */
      border-bottom-right-radius: 5px;
      box-shadow: 0 2px 5px rgba(165, 56, 96, 0.2);
      font-weight: 500; /* Slightly bolder for better readability */
    }
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--bg-white);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  input {
    flex: 1;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    background-color: var(--bg-light);
    font-size: 0.95rem;
    color: var(--text-medium);
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 168, 205, 0.3);
      color: var(--text-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background-color: var(--bg-gray);
    }

    &::placeholder {
      color: var(--text-light);
    }
  }

  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gradient-primary);
    border: none;
    color: white;
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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
      z-index: 0;
    }

    svg {
      position: relative;
      z-index: 1;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);

      &::before {
        opacity: 1;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;

      &:hover {
        transform: none;
        box-shadow: none;

        &::before {
          opacity: 0;
        }
      }
    }
  }
`;

const ChatModal = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 380px;
  height: 500px;
  background-color: var(--bg-white); /* Match the dark theme background */
  border-radius: var(--border-radius);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  border: 1px solid rgba(255, 168, 205, 0.2); /* Subtle border for better definition */

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: 576px) {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: var(--primary-light);
    border-radius: 50%;
    opacity: 0.6;
    animation: typing 1.4s infinite both;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0% {
      transform: translateY(0);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-5px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 0.6;
    }
  }
`;

export default Chatbot;
