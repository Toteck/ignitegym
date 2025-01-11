import axios from "axios";

const api = axios.create({
  baseURL: "https://ignitegym-api.onrender.com",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("INTERCEPTOR RESPONSE ERROR => ", error);
    return Promise.reject(error);
  }
);

export { api };
