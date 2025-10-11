import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";


// const BASE_URL = 'http://192.171.1.100:4000/'
// const BASE_URL = 'http://192.171.1.16:4000/'
const BASE_URL = 'https://api.df-neyshabor.ir/'
const api = axios.create({
  baseURL:BASE_URL ,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor




api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(
      "➡️ Request:",
      config.method?.toUpperCase(),
      config.url,
      config
    );
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error.message);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("❌ Response Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error("❌ No Response:", error.request);
    } else {
      console.error("❌ General Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
