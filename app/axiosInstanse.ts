import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-squareonecommunity.vercel.app', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export default axiosInstance;