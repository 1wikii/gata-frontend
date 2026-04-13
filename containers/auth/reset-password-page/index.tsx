// containers/auth/ResetPasswordContainer.tsx (Updated with Button Component)
"use client";
import React, { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResetPasswordData } from "@/types/auth";
import Image from "next/image";
import ErrorValidation from "@/components/forms/errorMessage";
import { Message } from "@/types/forms";

// Reset Password Form Component with API Integration
interface ResetPasswordFormProps {
  onResetPassword: (data: ResetPasswordData) => any;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const ResetPasswordPage: FC<ResetPasswordFormProps> = ({ onResetPassword }) => {
  const [formData, setFormData] = useState<ResetPasswordData>({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateField = (
    name: keyof ResetPasswordData,
    value: any
  ): string | undefined => {
    switch (name) {
      case "password":
        if (!value) return "Password wajib diisi";
        if (value.length < 6)
          return "Password harus terdiri dari minimal 6 karakter";
        break;
      case "confirmPassword":
        if (!value) return "Konfirmasi password wajib diisi";
        if (value !== formData.password)
          return "Password dan konfirmasi password tidak cocok";
        break;
    }
    return undefined;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof ResetPasswordData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (name: keyof ResetPasswordData, value: any) => {
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
  const handleInputBlur = (name: keyof ResetPasswordData) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

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
      // call the API
      const result = await onResetPassword(formData);

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
          text: result.message || "Password berhasil direset!",
        });
        setIsSuccess(true);

        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error during reset password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form normal - jika token valid
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
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                RESET PASSWORD
              </h2>

              <p className="text-gray-600 text-center text-sm mb-6">
                Masukkan password baru untuk akun Anda
              </p>

              {/* Message Display */}
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-lg text-center transition-all duration-300 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {!isSuccess ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Password Input */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Masukkan password baru "
                        className="form-input"
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        onBlur={() => handleInputBlur("password")}
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                        )}
                      </Button>
                    </div>

                    {errors.password && touched.password && (
                      <ErrorValidation error={errors.password} />
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder="Konfirmasi password baru"
                        className="form-input"
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        onBlur={() => handleInputBlur("confirmPassword")}
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                        )}
                      </Button>
                    </div>

                    {errors.confirmPassword && touched.confirmPassword && (
                      <ErrorValidation error={errors.confirmPassword} />
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submit-button"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        MEMPROSES...
                      </span>
                    ) : (
                      "RESET PASSWORD"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-green-700 text-sm">
                      Password berhasil direset! Anda akan dialihkan ke halaman
                      login dalam beberapa saat...
                    </p>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <a href="/mahasiswa/login">Masuk sekarang</a>
                  </Button>
                </div>
              )}
            </div>
            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Sudah ingat password?{" "}
                <a
                  href="/auth/login"
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

export default ResetPasswordPage;
