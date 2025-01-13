import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@services/api";

import { storageAuthTokenSave } from "@storage/storageAuthToken";

import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setLoadingUserStorageData] = useState(true);

  async function storageUserAndToken(userData: UserDTO, token: string) {
    try {
      setLoadingUserStorageData(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        await storageUserAndToken(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setLoadingUserStorageData(false);
    }
  }

  async function LoadUserData() {
    try {
      const userLogged = await storageUserGet();

      if (userLogged) {
        setUser(userLogged);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    LoadUserData();
    setLoadingUserStorageData(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
