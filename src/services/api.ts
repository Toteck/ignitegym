import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosInstance, AxiosError } from "axios";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "https://ignitegym-api.onrender.com",
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;

          if (isRefreshing) {
            // A primeira requisição não entra no IF
            // Mas na segunda vez entra
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/sessions/refresh-token", {
                refresh_token,
              });
              await storageAuthTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data
                );
              }

              // Atualiza o token da requisição atual
              originalRequestConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              // Atualiza o token das próximas requisições
              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              failedQueue.forEach((request) => {
                request.onSuccess(data.token);
              });

              console.log("TOKEN ATUALIZADO");

              resolve(api(originalRequestConfig));
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              // Chegando aqui temos o token atualizado
              isRefreshing = false;
              // limpa a fila de requisições
              failedQueue = [];
            }
          });
        }

        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
