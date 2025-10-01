import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// define the type from back end
interface ApiResponse<T = any> {
  code: number;
  msg?: string;
  data?: T;
}

// Create Axios
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // 
  timeout: 5000, // 5s
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code !== 200) {
      alert(res.msg || "请求失败");
      return Promise.reject(res);
    }
    return response; //  
  },
  (error) => {
    alert("Error. Please try again");
    return Promise.reject(error);
  }
);

export default api;
export type { ApiResponse };
