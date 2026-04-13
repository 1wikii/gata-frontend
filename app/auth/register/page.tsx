"use client";

import React, { FC } from "react";
import { useAuth } from "@/hooks/useAuth";
import RegisterPageContainer from "@/containers/auth/register-page/index";
import { RegisterData } from "@/types/auth";
import { api } from "@/utils/api";

const RegisterPage: FC = () => {
  const { login } = useAuth();

  // handle API call
  const handleRegister = async (formData: RegisterData) => {
    try {
      const response = await api.post("/auth/register", formData);
      const result = await response.json();

      if (response.ok) {
        login(result.data.token);
      }

      return result;
    } catch (error) {
      console.error("Error during register:", error);
    }
  };

  return (
    <main>
      <RegisterPageContainer onRegister={handleRegister} />
    </main>
  );
};

export default RegisterPage;
