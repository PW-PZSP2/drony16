import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const backendClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// token interceptor
backendClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor for handling 401 errors
backendClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // handle unauthorized access, e.g., redirect to login
      console.error("Unauthorized access - perhaps redirect to login?");
      // #TODO: implement redirection logic
    }
    return Promise.reject(error);
  },
);

export default backendClient;
