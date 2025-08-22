import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Debug: Log the baseURL to see if it's being loaded correctly
console.log('API Base URL:', baseURL);
console.log('Environment variable:', import.meta.env.VITE_API_BASE_URL);

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Request interceptor to log requests
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers,
      cookies: document.cookie
    });
    
    // Log cookies separately for better visibility
    console.log("Browser Cookies:", document.cookie);
    console.log("Cookie Length:", document.cookie.length);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      headers: response.headers
    });
    
    // Log cookies after login response
    if (response.config.url === '/auth/login') {
      console.log("Cookies after login:", document.cookie);
      console.log("Set-Cookie headers:", response.headers['set-cookie']);
    }
    
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    console.log("API Error:", {
      status,
      data,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      withCredentials: error.config?.withCredentials
    });

    if (status === 401) {
      console.log("Unauthorized - but not redirecting to avoid infinite loop");
      // Don't redirect automatically to avoid infinite loops
      // Let the individual components handle 401 errors
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
