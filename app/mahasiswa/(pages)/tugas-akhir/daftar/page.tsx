"use client";

import React, { useState, useEffect } from "react";
import TugasAkhirPage from "@/containers/mahasiswa/tugas-akhir-page/daftar-page/index";
import { api } from "@/utils/api";
import { FormDatas } from "@/containers/mahasiswa/tugas-akhir-page/daftar-page/index";
import Loading from "@/components/ui/loading";
import NotPeriod from "@/components/ui/error/student-not-period";
import AlreadyRegistered from "@/components/ui/error/student-already-final-project";
import { useAuth } from "@/hooks/useAuth";

export default function DaftarTugasAkhirPage() {
  const { user, isLoading } = useAuth();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isOnPeriod, setIsOnPeriod] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [finalProjectPeriodId, setFinalProjectPeriodId] = useState<
    string | null
  >(null);

  // API CALL
  const getLecturer = async (): Promise<any> => {
    try {
      const response = await api.get("/mahasiswa/tugas-akhir/dosen");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      throw error;
    }
  };

  const convertSubmitDataToFormData = (data: FormDatas) => {
    const formData = new FormData();

    // Add basic fields
    formData.append("type", data.type);
    formData.append("jumlahAnggota", data.jumlahAnggota);
    formData.append("status", data.status);
    formData.append("source_topic", data.source_topic);
    formData.append("supervisor1Id", data.supervisor1Id);
    formData.append("supervisor2Id", data.supervisor2Id);
    if (data.finalProjectPeriodId) {
      formData.append("finalProjectPeriodId", data.finalProjectPeriodId);
    }

    // Add member data

    const membersData = data.formData.map((m) => ({
      email: m.email,
      title: m.title,
      resume: m.resume,
      studentId: m.studentId,
    }));

    formData.append("members", JSON.stringify(membersData));

    data.formData.forEach((member, index) => {
      if (member.draft_path) {
        formData.append(`draft_path_${index}`, member.draft_path);
      }

      if (member.dispen_path) {
        formData.append(`dispen_path_${index}`, member.dispen_path);
      }
    });

    return formData;
  };

  const getFinalProjectHistory = async (): Promise<any> => {
    try {
      if (!isLoading && user) {
        const response = await api.get(
          `/mahasiswa/tugas-akhir/riwayat/${user.id}`
        );
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error("Error fetching final project history:", error);
      throw error;
    }
  };

  // handle submit
  const handleSubmit = async (data: FormDatas): Promise<any> => {
    try {
      // Convert data to FormData before sending to API
      const formData = convertSubmitDataToFormData(data);

      const response = await api.postWithFile(
        "/mahasiswa/tugas-akhir/daftar",
        formData
      );

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error submitting data:", error);
      throw error;
    }
  };

  const handleFirstLoad = async (): Promise<any> => {
    try {
      const response = await api.get("/mahasiswa/tugas-akhir/periode");
      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Error during first load:", error);
    } finally {
      setIsFirstLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await handleFirstLoad();
      if (result && result.data) {
        setFinalProjectPeriodId(result.data.id.toString());
        setIsOnPeriod(true);
      } else {
        setIsOnPeriod(false);
      }
      setIsFirstLoading(false);
      return;
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const historyResult = await getFinalProjectHistory();

        if (historyResult && historyResult.data.data) {
          setIsAlreadyRegistered(true);
        } else {
          setIsAlreadyRegistered(false);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      } finally {
        setIsFirstLoading(false);
      }
    };

    if (!isLoading && user) {
      checkRegistrationStatus();
    }
  }, [user, isLoading]);

  if (isFirstLoading || isLoading) {
    return <Loading />;
  }

  if (!isOnPeriod) {
    return <NotPeriod />;
  }

  if (isAlreadyRegistered) {
    return <AlreadyRegistered />;
  }
  return (
    <>
      {isOnPeriod && !isAlreadyRegistered && (
        <TugasAkhirPage
          getLecturer={getLecturer}
          onSubmit={handleSubmit}
          finalProjectPeriodId={finalProjectPeriodId}
        />
      )}
    </>
  );
}
