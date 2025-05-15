import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faCheckCircle, 
  faPaperPlane, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm NutriBot, your personal nutrition assistant. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatBodyRef = useRef(null);
  
  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Toggle chat modal
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  // Get bot response based on user input
  const getBotResponse = (input) => {
    // This is a simple simulation - in a real app, this would connect to an API
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return {
        type: 'bot',
        text: "Hi there! How can I help with your nutrition questions today?"
      };
    } else if (lowerInput.includes('calorie') || lowerInput.includes('calories')) {
      return {
        type: 'bot',
        text: "Calories are a measure of energy in food. The average adult needs about 2000-2500 calories per day, but this varies based on age, gender, weight, height, and activity level. Would you like me to calculate your specific calorie needs?"
      };
    } else if (lowerInput.includes('protein')) {
      return {
        type: 'bot',
        text: "Protein is essential for building muscle and repairing tissues. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts. The recommended daily intake is about 0.8g per kg of body weight for most adults."
      };
    } else if (lowerInput.includes('vitamin')) {
      return {
        type: 'bot',
        text: "Vitamins are essential nutrients that your body needs in small amounts. They're found in a variety of foods, especially fruits and vegetables. Which specific vitamin would you like to know more about?"
      };
    } else if (lowerInput.includes('sugar')) {
      return {
        type: 'bot',
        text: "Added sugars should be limited in a healthy diet. The American Heart Association recommends no more than 36g (9 teaspoons) for men and 25g (6 teaspoons) for women per day. Natural sugars found in fruits and dairy are generally considered healthier than added sugars."
      };
    } else {
      return {
        type: 'bot',
        text: "That's an interesting nutrition question! While I'm just a demo chatbot with limited responses, the full version of NutriBot would provide detailed information about this topic. Is there something specific about nutrition you'd like to know?"
      };
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
              <ChatbotInfo>
                <h2>Nutrition Assistant</h2>
                <p className="lead">Have questions about nutrition? Our AI-powered chatbot can help you with personalized advice and answers.</p>
                <ChatbotFeatures>
                  {features.map((feature, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {feature}
                    </li>
                  ))}
                </ChatbotFeatures>
                <ChatButton onClick={toggleChat}>Start Chatting</ChatButton>
              </ChatbotInfo>
            </div>
            <div className="col-lg-6">
              <ChatbotPreview>
                <ChatHeader>
                  <ChatAvatar>
                    <FontAwesomeIcon icon={faRobot} />
                  </ChatAvatar>
                  <ChatTitle>
                    <h4>NutriBot</h4>
                    <Status>Online</Status>
                  </ChatTitle>
                </ChatHeader>
                <ChatMessages>
                  <Message className="bot">
                    <p>Hello! I'm NutriBot, your personal nutrition assistant. How can I help you today?</p>
                  </Message>
                  <Message className="user">
                    <p>Is orange juice healthier than soda?</p>
                  </Message>
                  <Message className="bot">
                    <p>While orange juice contains vitamins and minerals not found in soda, it's important to note that both can be high in sugar. A typical 8oz serving of orange juice contains about 21g of sugar, while the same amount of soda has about 26g.</p>
                  </Message>
                  <Message className="bot">
                    <p>For a healthier option, I'd recommend water with a splash of fresh orange juice or herbal tea. Would you like more specific comparisons?</p>
                  </Message>
                </ChatMessages>
                <ChatInputContainer>
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
              <h4>NutriBot</h4>
              <Status>Online</Status>
            </ChatTitle>
            <CloseButton onClick={toggleChat}>
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </ChatHeader>
          <ChatBody ref={chatBodyRef}>
            {messages.map((message, index) => (
              <Message key={index} className={message.type}>
                <p>{message.text}</p>
              </Message>
            ))}
          </ChatBody>
          <form onSubmit={handleSubmit}>
            <ChatInputContainer>
              <input 
                type="text" 
                placeholder="Type your nutrition question..." 
                value={inputValue}
                onChange={handleInputChange}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faPaperPlane} />
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
    color: var(--primary-dark);
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
    color: var(--text-medium);
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
    color: var(--text-medium);
    
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(165, 56, 96, 0.4);
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
      color: var(--text-dark);
      border-bottom-left-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
  }
  
  &.user {
    align-self: flex-end;
    
    p {
      background: var(--gradient-primary);
      color: white;
      border-bottom-right-radius: 5px;
      box-shadow: 0 2px 5px rgba(165, 56, 96, 0.2);
    }
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  input {
    flex: 1;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    background-color: var(--bg-light);
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(165, 56, 96, 0.2);
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
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(165, 56, 96, 0.3);
    }
  }
`;

const ChatModal = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 380px;
  height: 500px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  
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

export default Chatbot;
