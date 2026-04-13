"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordPage from "@/containers/auth/reset-password-page";
import Loading from "@/components/ui/loading";
import TokenExpired from "@/components/ui/error/token-expired";
import { api } from "@/utils/api";
import { ResetPasswordData } from "@/types/auth";

export default function resetPassword() {
  const [loading, setLoading] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // API CALL
  const handleResetPassword = async (
    formData: ResetPasswordData
  ): Promise<any> => {
    try {
      const response = await api.post("/auth/reset-password", {
        token: token?.trim() || "",
        password: formData.password,
      });
      const result = await response.json();

      if (!response.ok) {
        setIsTokenExpired(true);
      }

      return result;
    } catch (error) {
      console.error("Error during reset password:", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/auth/reset-password/${token}`, {});

        if (!response.ok) {
          setIsTokenExpired(true);
        }
      } catch (error) {
        console.error("Error during verify token:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isTokenExpired) {
    return <TokenExpired />;
  }

  return <ResetPasswordPage onResetPassword={handleResetPassword} />;
}
