"use client";

import React, { FC } from "react";
import LoginPage from "@/containers/auth/login-page/index";
import { LoginData } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";

const Login: FC = () => {
  const { login } = useAuth();

  // API CALL
  const handleLogin = async (formData: LoginData): Promise<any> => {
    try {
      const response = await api.post("/auth/login", formData);
      const result = await response.json();

      if (response.ok) {
        login(result.data.token);
      }

      return result;
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <main>
      <LoginPage onLogin={handleLogin} />
    </main>
  );
};

export default Login;
