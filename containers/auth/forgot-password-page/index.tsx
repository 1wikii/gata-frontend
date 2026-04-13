"use client";
import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import InputLabel from "@/components/forms/inputLabel";
import ErrorValidation from "@/components/forms/errorMessage";
import { ForgotPasswordData } from "@/types/auth";
import { Message } from "@/types/forms";

interface ForgotPasswordPageProps {
  onForgotPassword: (formData: ForgotPasswordData) => any;
}
interface FormErrors {
  email?: string;
  password?: string;
}

const ForgotPasswordPage: FC<ForgotPasswordPageProps> = ({
  onForgotPassword,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<Message>({
    type: "",
    text: "",
  });

  // Validation functions
  const validateField = (
    name: keyof { email: string },
    value: any
  ): string | undefined => {
    switch (name) {
      case "email":
        if (!value) return "Email wajib diisi";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Format email tidak valid";
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof ForgotPasswordData>).forEach(
      (key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    );

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (name: keyof ForgotPasswordData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle input blur
  const handleInputBlur = (name: keyof ForgotPasswordData) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await onForgotPassword(formData);

      if (result.errors) {
        const newErrors = Array.isArray(result.errors)
          ? Object.fromEntries(result.errors.map((e: any) => [e.path, e.msg]))
          : { [result.errors.path]: result.errors.msg };

        setErrors((prev: any) => ({
          ...prev,
          ...newErrors,
        }));

        return;
      } else {
        setMessage({
          type: "success",
          text:
            result.message ||
            "Berhasil mengirim link reset password ke email Anda.",
        });
      }

      setErrors({});
      setTouched({});
    } catch (error: any) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Blue Background with Reset Password Illustration */}
      <section className="bg-primary flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Image
              src="/images/forget-password.svg"
              alt="Reset Password Illustration"
              width={500}
              height={400}
              className="max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Right Column - White Background with Logo and Reset Password Form */}
      <section className="bg-secondary flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/teknik-informatika.svg"
                alt="Teknik Informatika Logo"
                width={350}
                height={350}
              />
            </div>
          </div>

          {/* Reset Password Form Card */}
          <div className="main-container">
            <div>
              <p className="text-center text-sm mb-6">
                Masukkan email Anda untuk menerima link reset password
              </p>

              {/* Message */}
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-lg text-center transition-all duration-300 ${
                    message.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <InputLabel label="Email" />
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    placeholder="contoh: email@student.itera.ac.id"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleInputBlur("email")}
                    required
                    disabled={isSubmitting}
                  />

                  {touched.email && errors.email && (
                    <ErrorValidation error={errors.email} />
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="form-submit-button"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 "
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      MENGIRIM...
                    </span>
                  ) : (
                    "KIRIM"
                  )}
                </button>
              </form>
            </div>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Sudah ingat password?{" "}
                <a
                  href="/mahasiswa/login"
                  className="underline font-medium hover:text-primary transition-colors duration-200"
                >
                  Masuk disini
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
