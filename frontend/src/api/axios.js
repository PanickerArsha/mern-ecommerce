import axios from "axios";

// Create an instance of axios with a base URL for the backend API
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend API URL
});

export default api;