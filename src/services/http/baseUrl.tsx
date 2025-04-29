import axios from "axios";
import Cookies from "js-cookie";

console.log("REACT_APP_ADV_URL => ", process.env.REACT_APP_ADV_URL);

const api = axios.create({
  baseURL: "https://avoapi-befee013666a.herokuapp.com",

  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config: any) => {
    const userData = Cookies.get("user_data")
      ? JSON.parse(Cookies.get("user_data"))
      : null;
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
