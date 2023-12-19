import axios from "axios";

// Default config options
const defaultOptions: any = {
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Create instance
const request = axios.create(defaultOptions);

// Set the AUTH token for any request
request.interceptors.request.use(function (config) {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

export default request;
