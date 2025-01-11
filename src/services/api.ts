import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: "https://ignitegym-api.onrender.com",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1: Verificar se é uma mensagem de erro tratada pelo servidor
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
