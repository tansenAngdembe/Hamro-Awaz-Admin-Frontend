import axios from "axios";
import config from "../utils/config";

const api = axios.create({
  baseURL: config.serverURL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return api(originalRequest);
      }

      isRefreshing = true;
      try {
        await api.post("/refreshToken", {}, { withCredentials: true });
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
