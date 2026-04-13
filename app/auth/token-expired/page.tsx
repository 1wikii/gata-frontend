"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function TokenExpiredPage() {
  const { logout } = useAuth();

  React.useEffect(() => {
    setTimeout(() => {
      logout();
    }, 3000);
  }, []);

  return (
    <div>
      <h1>Token Expired</h1>
      <p>Your session has expired. Please log in again.</p>
    </div>
  );
}
