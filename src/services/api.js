import axios from "axios";

// Create axios instance with direct URL
const api = axios.create({
  baseURL: "https://juice-nutrition-comparator.onrender.com",
  // Don't set Content-Type here as it will be set automatically for FormData
});

// Function to analyze product image
export const fetchData = async (formData) => {
  try {
    // Send directly to the /analyze endpoint
    const response = await api.post("/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Example function to get data
export const getData = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

export default api;
