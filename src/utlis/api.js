import axios from "axios";

// 1. Base URL set karein
const api = axios.create({
  baseURL: "https://app.sbresto.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Har request se pehle yeh code chalega)
api.interceptors.request.use(
  (config) => {
    // LocalStorage se token uthayein
    const token = localStorage.getItem("token");

    // Agar token majood hai, to header mein add karein
    if (token) {
      // API documentation ke hisab se 'Bearer' use hota hai usually
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Optional: Agar token expire ho jaye to auto-logout ke liye)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar server 401 Unauthenticated return kare (Token expire/invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: Page ko login par redirect kar dein
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;