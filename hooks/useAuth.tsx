"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  getUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initUser = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser(payload);
          } catch (error) {
            console.error("Error parsing token:", error);
            localStorage.removeItem("token");
          }
        }
      }
      setIsLoading(false);
    };
    initUser();
  }, []);

  const getUser = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload;
        } catch (error) {
          console.error("Error parsing token:", error);
          return null;
        }
      }
    }
    return null;
  };

  const login = (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
    }
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split(".")[1]));
      setUser(payload);
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    setUser(null);

    const logout = await api.postWithAuth("/auth/logout", {});

    if (logout.ok) {
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, getUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
