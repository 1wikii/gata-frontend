"use client";

import React, { FC, use, useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import ErrorValidation from "@/components/forms/errorMessage";
import { RegisterData } from "@/types/auth";
import InputLabel from "@/components/forms/inputLabel";

interface RegisterPageProps {
  onRegister: (formData: RegisterData) => any;
}

interface FormErrors {
  nim?: string;
  semester?: string;
  name?: string;
  whatsapp_number?: string;
  email?: string;
  password?: string;
}

const RegisterPage: FC<RegisterPageProps> = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    nim: "",
    semester: 1,
    name: "",
    whatsapp_number: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateField = (
    name: keyof RegisterData,
    value: any
  ): string | undefined => {
    switch (name) {
      case "nim":
        if (!value) return "NIM wajib diisi";
        if (!/^[0-9]{9}$/.test(value)) return "NIM harus berupa 9 digit angka";
        break;
      case "semester":
        if (!value) return "Semester wajib diisi";
        if (parseInt(value) < 7) return "Semester minimal 7";
        if (parseInt(value) > 14) return "Semester maksimal 14";
        if (!/^\d+$/.test(value)) return "Semester harus berupa angka";
        break;
      case "name":
        if (!value) return "Nama wajib diisi";
        if (value.length < 2) return "Nama minimal 2 karakter";
        if (value.length > 100) return "Nama maksimal 100 karakter";
        break;
      case "whatsapp_number":
        if (!value) return "Nomor WhatsApp wajib diisi";
        if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(value))
          return "Format nomor WhatsApp tidak valid";
        break;
      case "email":
        if (!value) return "Email wajib diisi";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Format email tidak valid";
        break;
      case "password":
        if (!value) return "Password wajib diisi";
        if (value.length < 8) return "Password minimal 8 karakter";
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof RegisterData>).forEach((key) => {
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
  const handleInputChange = (name: keyof RegisterData, value: any) => {
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
  const handleInputBlur = (name: keyof RegisterData) => {
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
      const result = await onRegister(formData);

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
        window.location.reload();
      }

      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Blue Background with Register Illustration */}
      <section className="bg-primary flex flex-col items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/images/auth-register.svg"
            alt="Person registering on mobile device"
            width={500}
            height={400}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Right Column - White Background with Registration Form */}
      <section className="bg-gray-100 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/teknik-informatika.svg`}
                alt="Teknik Informatika Logo"
                width={350}
                height={350}
              />
            </div>
          </div>
          {/* Registration Form Card */}
          <div className="main-container">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* NIM and Semester Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputLabel label="NIM" />
                  <input
                    name="nim"
                    type="text"
                    className="form-input"
                    placeholder="contoh: 12xxxxxxx"
                    value={formData.nim}
                    onChange={(e) => handleInputChange("nim", e.target.value)}
                    onBlur={() => handleInputBlur("nim")}
                  />

                  {touched.nim && errors.nim && (
                    <ErrorValidation error={errors.nim} />
                  )}
                </div>
                <div>
                  <InputLabel label="Semester" />
                  <input
                    name="semester"
                    type="text"
                    className="form-input"
                    value={formData.semester}
                    onChange={(e) =>
                      handleInputChange("semester", e.target.value)
                    }
                    onBlur={() => handleInputBlur("semester")}
                    onKeyDown={(e) => {
                      // Izinkan tombol navigasi & kontrol (Backspace, Delete, Tab, panah, dll)
                      if (
                        [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Home",
                          "End",
                        ].includes(e.key)
                      ) {
                        return;
                      }

                      // Cegah input kalau bukan angka 0-9
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />

                  {touched.semester && errors.semester && (
                    <ErrorValidation error={errors.semester} />
                  )}
                </div>
              </div>

              {/* Nama */}
              <div>
                <InputLabel label="Nama" />
                <input
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="contoh: Ahmad Syahroni"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleInputBlur("name")}
                />

                {touched.name && errors.name && (
                  <ErrorValidation
                    className="bg-red-500/10 p-1 rounded-lg"
                    error={errors.name}
                  />
                )}
              </div>

              {/* Nomor Whatsapp */}
              <div>
                <InputLabel label="Nomor Whatsapp" />
                <input
                  name="whatsapp_number"
                  type="tel"
                  className="form-input"
                  placeholder="contoh: 08xxxxxxxxxx"
                  value={formData.whatsapp_number}
                  onChange={(e) =>
                    handleInputChange("whatsapp_number", e.target.value)
                  }
                  onBlur={() => handleInputBlur("whatsapp_number")}
                />

                {touched.whatsapp_number && errors.whatsapp_number && (
                  <ErrorValidation
                    className="bg-red-500/10 p-1 rounded-lg"
                    error={errors.whatsapp_number}
                  />
                )}
              </div>

              {/* Email */}
              <div>
                <InputLabel label="Email" />
                <input
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="contoh: email@student.itera.ac.id"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleInputBlur("email")}
                />

                {touched.email && errors.email && (
                  <ErrorValidation
                    className="bg-red-500/10 p-1 rounded-lg"
                    error={errors.email}
                  />
                )}
              </div>

              {/* Password */}
              <div>
                <InputLabel label="Password" />
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleInputBlur("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <ErrorValidation
                    className="bg-red-500/10 p-1 rounded-lg"
                    error={errors.password}
                  />
                )}
              </div>

              <button
                type="submit"
                className="form-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mendaftarkan..." : "Daftar"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Sudah punya akun?{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`}
                  className="font-medium text-gray-900 hover:text-primary underline underline-offset-4 transition-colors duration-200"
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

export default RegisterPage;
