import axios from "axios";

// 1. Base URL set karein
const api = axios.create({
  baseURL: "https://app.sbresto.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem("token");


    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
 
    }
    return Promise.reject(error);
  }
);

export default api;