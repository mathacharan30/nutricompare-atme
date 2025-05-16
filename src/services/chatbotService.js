import axios from 'axios';

// Base URL for the API - the actual chatbot API endpoint
const API_URL = 'https://nutricompare-chatbot.onrender.com';

// Create an axios instance with default config
const chatbotApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }, // 15 seconds timeout (increased because render.com free tier can be slow on first request)
});

/**
 * Send a message to the chatbot API
 * @param {string} message - The user's message
 * @param {string} sessionId - The current chat session ID (not used with the new API)
 * @returns {Promise} - The API response
 */
export const sendMessage = async (message, sessionId) => {
  try {
    const response = await chatbotApi.post('/chat', {
      query: message,
    });

    // Format the response to match what the component expects
    return {
      message: response.data.summary,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error sending message to chatbot:', error);

    // For development/demo purposes, return a mock response if the API fails
    return getMockResponse(message);
  }
};

/**
 * Start a new chat session
 * @returns {Promise} - The API response with welcome message
 */
export const startSession = async () => {
  try {
    // The new API doesn't have a session concept, so we'll just return a welcome message
    return {
      sessionId: `session-${Date.now()}`, // We'll keep this for compatibility
      message: "Welcome to CalQ! I'm your personal nutrition assistant. How can I help you today?",
    };
  } catch (error) {
    console.error('Error starting chatbot session:', error);

    // For development/demo purposes, return a mock session if the API fails
    return {
      sessionId: `mock-session-${Date.now()}`,
      message: "Welcome to CalQ! I'm your personal nutrition assistant. How can I help you today?",
    };
  }
};

/**
 * End a chat session
 * @param {string} sessionId - The current chat session ID (not used with the new API)
 * @returns {Promise} - The API response
 */
export const endSession = async (sessionId) => {
  // The new API doesn't have a session concept, so we'll just return a success response
  return { success: true };
};

/**
 * Generate a mock response for development/demo purposes
 * @param {string} message - The user's message
 * @returns {object} - A mock response object
 */
const getMockResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // Greeting patterns
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      message: "Hello there! How can I help with your nutrition questions today?",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about calories
  if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
    return {
      message: "Calories are a measure of energy in food. The average adult needs about 2000-2500 calories per day, but this varies based on age, gender, weight, height, and activity level. Would you like me to calculate your specific calorie needs?",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about protein
  if (lowerMessage.includes('protein')) {
    return {
      message: "Protein is essential for building muscle and repairing tissues. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts. The recommended daily intake is about 0.8g per kg of body weight for most adults.",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about vitamins
  if (lowerMessage.includes('vitamin')) {
    return {
      message: "Vitamins are essential nutrients that your body needs in small amounts. They're found in a variety of foods, especially fruits and vegetables. Which specific vitamin would you like to know more about?",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about sugar
  if (lowerMessage.includes('sugar')) {
    return {
      message: "Added sugars should be limited in a healthy diet. The American Heart Association recommends no more than 36g (9 teaspoons) for men and 25g (6 teaspoons) for women per day. Natural sugars found in fruits and dairy are generally considered healthier than added sugars.",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about fruits
  if (lowerMessage.includes('fruit')) {
    return {
      message: "Fruits are excellent sources of vitamins, minerals, and fiber. Most adults should aim for 1.5-2 cups of fruit daily. Berries, apples, and citrus fruits are particularly high in antioxidants and have a lower glycemic index compared to tropical fruits.",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about vegetables
  if (lowerMessage.includes('vegetable') || lowerMessage.includes('veggies')) {
    return {
      message: "Vegetables are crucial for a healthy diet, providing fiber, vitamins, and minerals. Aim for 2-3 cups daily, with a variety of colors to ensure diverse nutrients. Dark leafy greens like spinach and kale are particularly nutrient-dense.",
      timestamp: new Date().toISOString(),
    };
  }

  // Questions about water or hydration
  if (lowerMessage.includes('water') || lowerMessage.includes('hydration') || lowerMessage.includes('drink')) {
    return {
      message: "Staying hydrated is essential for overall health. The general recommendation is about 8 cups (64 ounces) of water daily, but needs vary based on activity level, climate, and individual factors. Your urine should be pale yellow - that's a good indicator of proper hydration.",
      timestamp: new Date().toISOString(),
    };
  }

  // Default response for other queries
  return {
    message: "That's an interesting nutrition question! While I'm just a demo chatbot with limited responses, the full version of CalQ would provide detailed information about this topic. Is there something specific about nutrition you'd like to know?",
    timestamp: new Date().toISOString(),
  };
};

export default {
  sendMessage,
  startSession,
  endSession,
};
