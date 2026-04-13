"use client";

import React, { useState } from "react";
import ForgotPasswordPage from "@/containers/auth/forgot-password-page";
import { api } from "@/utils/api";
import { ForgotPasswordData } from "@/types/auth";

export default function ResetPassword() {
  // API CALL
  const handleForgotPassword = async (
    formData: ForgotPasswordData
  ): Promise<any> => {
    try {
      const response = await api.post("/auth/forgot-password", formData);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error during forgot password:", error);
    }
  };
  return <ForgotPasswordPage onForgotPassword={handleForgotPassword} />;
}
