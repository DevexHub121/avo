import axios from "axios";
import Cookies from "js-cookie";

console.log("REACT_APP_ADV_URL => ", process.env.REACT_APP_ADV_URL);

const api = axios.create({
  baseURL: "https://avoapi-befee013666a.herokuapp.com",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiMultiPart = axios.create({
  baseURL: "https://avoapi-befee013666a.herokuapp.com",

  headers: {
    // Accept: "application/json",
    "Content-Type": 'multipart/form-data'
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config: any) => {
    let userData = null;
    const cookie = Cookies.get("user_data");
    if (cookie && cookie !== "undefined") {
      try {
        userData = JSON.parse(cookie);
      } catch (e) {
        console.warn("Failed to parse user_data cookie:", e);
      }
    }
    const authToken = userData?.auth_token;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;