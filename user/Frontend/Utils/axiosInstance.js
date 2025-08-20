// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true  
// });

// export default axiosInstance;


import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // This ensures cookies are sent with requests
});

// Add request interceptor to include token if stored
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // If you're using localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;