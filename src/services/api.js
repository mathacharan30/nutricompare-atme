import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/analyze", // This will use the proxy we set up in vite.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Example function to fetch data
export const fetchData = async (data) => {
  try {
    const response = await api.post("/", data);
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
