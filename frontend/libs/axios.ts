import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 🌐 Base URL — خواندن از env
// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.df-neyshabor.ir/";

const BASE_URL = 'http://localhost:4000'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // ⏳ افزایش تایم‌اوت برای درخواست‌های کندتر
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
        config.params || config.data || ""
      );
    }

    // 🔐 اضافه کردن توکن JWT در صورت وجود
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

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
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ Response [${response.status}] ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("❌ Response Error:", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });

      // ⚠️ اگر توکن منقضی شده باشد
      if (error.response.status === 401 && typeof window !== "undefined") {
        console.warn("🔒 توکن منقضی شده. لطفاً دوباره وارد شوید.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("❌ No Response from server:", error.message);
    } else {
      console.error("❌ General Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
