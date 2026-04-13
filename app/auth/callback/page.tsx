"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/loading";

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      login(token);
    }
  }, []);

  // useEffect(() => {
  //   if (user?.role == "admin") {
  //     router.push("/admin");
  //   } else if (user?.role == "lecturer") {
  //     router.push("/dosen");
  //   } else {
  //     router.push("/mahasiswa");
  //   }
  // }, [user]);

  return <Loading />;
};

export default CallbackPage;
