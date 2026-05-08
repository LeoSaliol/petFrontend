import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;