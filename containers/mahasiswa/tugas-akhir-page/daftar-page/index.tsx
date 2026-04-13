"use client";
import React, { useState, useEffect } from "react";
import DaftarForm from "./DaftarForm";
import JenisForm from "./JenisForm";
import { Student } from "@/containers/mahasiswa/tugas-akhir-page/daftar-page/searchableStudentInput";
import { Message } from "@/types/forms";

interface Props {
  getLecturer: () => Promise<any>;
  onSubmit: (data: FormDatas) => Promise<any>;
  finalProjectPeriodId: string | null;
}
export interface FormDatas {
  type: string;
  jumlahAnggota: string;
  status: string;
  source_topic: string;
  supervisor1Id: string;
  supervisor2Id: string;
  finalProjectPeriodId: string | null;
  formData: FormData[];
}
export interface FormData {
  email: string;
  studentId: string;
  title: string;
  resume: string;
  draft_path: File | string | null;
  dispen_path: File | string | null;
}

const initialFormDatas: FormDatas = {
  type: "",
  jumlahAnggota: "",
  status: "",
  supervisor1Id: "",
  supervisor2Id: "",
  source_topic: "",
  finalProjectPeriodId: null,
  formData: [],
};
export const initialFormData: FormData = {
  email: "",
  studentId: "",
  title: "",
  resume: "",
  draft_path: null,
  dispen_path: null,
};

const TugasAkhirForm: React.FC<Props> = ({
  getLecturer,
  onSubmit,
  finalProjectPeriodId,
}) => {
  const [formDatas, setFormDatas] = useState<FormDatas>(initialFormDatas);
  const [isDaftarForm, setIsDaftarForm] = useState<boolean>(false);
  const [currentMemberIndex, setCurrentMemberIndex] = useState<number>(0);
  const [isSuratDispensasiEnabled, setIsSuratDispensasiEnabled] =
    useState<boolean>(false);

  const [formDataErrors, setFormDataErrors] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  // init finalProjectPeriodId
  useEffect(() => {
    setFormDatas((prev) => ({ ...prev, finalProjectPeriodId }));
  }, []);

  // Initialize form data for each member when jumlahAnggota changes
  useEffect(() => {
    if (formDatas.jumlahAnggota && !isDaftarForm) {
      const memberCount = parseInt(formDatas.jumlahAnggota);
      const newFormData = Array.from({ length: memberCount }, () => ({
        ...initialFormData,
      }));
      setFormDatas((prev) => ({ ...prev, formData: newFormData }));
    }
  }, [formDatas.jumlahAnggota, isDaftarForm]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(e);
    if (e.target.name === "status") {
      setIsSuratDispensasiEnabled(e.target.value === "dispensasi");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormDatas((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormDataChange = (e: React.ChangeEvent<any> | Student | null) => {
    if (!e) return;

    if ("id" in e) {
      // If e is a Student object
      const { studentId, email } = e;

      // Check if email already exists in other formData entries
      const isDuplicate = formDatas.formData.some(
        (form, index) => index !== currentMemberIndex && form.email === email
      );

      // If duplicate, clear email and studentId; otherwise set them
      const finalEmail = isDuplicate ? "" : email;
      const finalStudentId = isDuplicate ? "" : studentId;

      // Set error if duplicate
      if (isDuplicate) {
        setFormDataErrors((prev) => ({
          ...prev,
          email: "Email sudah digunakan oleh anggota lain",
        }));
      } else {
        // Clear error if not duplicate
        setFormDataErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }

      setFormDatas((prev) => ({
        ...prev,
        formData: prev.formData.map((form, index) =>
          index === currentMemberIndex
            ? { ...form, email: finalEmail, studentId: finalStudentId }
            : form
        ),
      }));
    } else {
      const { name, value } = e.target;
      setFormDatas((prev) => ({
        ...prev,
        formData: prev.formData.map((form, index) =>
          index === currentMemberIndex ? { ...form, [name]: value } : form
        ),
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;

    // Validate file size , max 10MB
    if (file && file.size > 10 * 1024 * 1024) {
      // Clear the file input
      e.target.value = "";

      setFormDataErrors((prev) => ({
        ...prev,
        [name]: "Ukuran file maksimal 10MB",
      }));

      // Don't save the file to state
      setFormDatas((prev) => ({
        ...prev,
        formData: prev.formData.map((form, index) =>
          index === currentMemberIndex ? { ...form, [name]: null } : form
        ),
      }));
      return;
    }

    // Clear any previous error for this field
    if (formDataErrors[name as keyof FormData]) {
      setFormDataErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }

    // Save the file to state
    setFormDatas((prev) => {
      const newFormDatas = {
        ...prev,
        formData: prev.formData.map((form, index) =>
          index === currentMemberIndex ? { ...form, [name]: file } : form
        ),
      };
      return newFormDatas;
    });
  };

  const handleNextMember = () => {
    if (currentMemberIndex < parseInt(formDatas.jumlahAnggota) - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const handlePreviousMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can add API call here
    try {
      const result = await onSubmit(formDatas);
      if (result.errors) {
        setErrors((prev: any) => ({
          ...prev,
          ...Object.fromEntries(result.errors.map((e: any) => [e.path, e.msg])),
        }));

        return;
      } else {
        setMessage({
          type: "success",
          text: result.message || "Periode berhasil dipublish",
        });
        setTimeout(() => {
          window.location.href = "/mahasiswa/tugas-akhir/riwayat";
        }, 2000);

        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const isLastMember =
    currentMemberIndex === parseInt(formDatas.jumlahAnggota) - 1;
  const isFirstMember = currentMemberIndex === 0;

  return (
    <div className="main-container max-w-4xl mx-auto rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">
        PENGAJUAN TUGAS AKHIR
      </h1>

      {!isDaftarForm ? (
        <JenisForm
          formDatas={formDatas}
          setIsDaftarForm={setIsDaftarForm}
          handleInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          getLecturer={getLecturer}
        />
      ) : (
        <div>
          {/* Member Progress Indicator */}
          {parseInt(formDatas.jumlahAnggota) > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Anggota {currentMemberIndex + 1} dari{" "}
                  {formDatas.jumlahAnggota}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(
                    ((currentMemberIndex + 1) /
                      parseInt(formDatas.jumlahAnggota)) *
                      100
                  )}
                  % selesai
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentMemberIndex + 1) /
                        parseInt(formDatas.jumlahAnggota)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <DaftarForm
            formData={formDatas.formData[currentMemberIndex]}
            handleInputChange={handleFormDataChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            handleNext={handleNextMember}
            currentMemberIndex={currentMemberIndex}
            totalMembers={parseInt(formDatas.jumlahAnggota)}
            isLastMember={isLastMember}
            isFirstMember={isFirstMember}
            onPreviousMember={handlePreviousMember}
            isSuratDispensasiEnabled={isSuratDispensasiEnabled}
            formDataErrors={formDataErrors}
            setFormDataErrors={setFormDataErrors}
            errorsFromApi={errors}
            messageFromApi={message}
          />
        </div>
      )}
    </div>
  );
};

export default TugasAkhirForm;
