"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import { LoginData } from "@/types/auth";
import { Eye, EyeOff } from "lucide-react";
import ErrorValidation from "@/components/forms/errorMessage";
import { FcGoogle } from "react-icons/fc";
import InputLabel from "@/components/forms/inputLabel";
import { Button } from "@/components/ui/button";

interface LoginPageProps {
  onLogin: (formData: LoginData) => any;
}
interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: FC<LoginPageProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateField = (
    name: keyof LoginData,
    value: any
  ): string | undefined => {
    switch (name) {
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

    (Object.keys(formData) as Array<keyof LoginData>).forEach((key) => {
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
  const handleInputChange = (name: keyof LoginData, value: any) => {
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
  const handleInputBlur = (name: keyof LoginData) => {
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
      const result = await onLogin(formData);

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
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Blue Background with Graduates Illustration */}
      <section className="bg-primary flex items-center justify-center p-8">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/images/auth-login.svg"
            alt="Graduates celebrating"
            width={500}
            height={400}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Right Column - White Background with Logo and Login Form */}
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
          {/* Login Form Card */}
          <div className="main-container">
            <div className="relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <InputLabel label="Email" />
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="contoh: email@student.itera.ac.id"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleInputBlur("email")}
                  />

                  {touched.email && errors.email && (
                    <ErrorValidation error={errors.email} />
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <InputLabel label="Password" />
                    <a
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password`}
                      className="text-sm font-medium text-gray-900 hover:text-primary underline-offset-4 transition-colors duration-200 cursor-pointer"
                    >
                      Lupa Password ?
                    </a>
                  </div>
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
                    <ErrorValidation error={errors.password} />
                  )}
                </div>

                <button type="submit" className="form-submit-button">
                  {isSubmitting ? "Loading..." : "Masuk"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`}
                    className="font-medium text-gray-900 hover:text-primary underline underline-offset-4 transition-colors duration-200"
                  >
                    Daftar disini
                  </a>
                </p>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">
                    atau
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white/80 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] h-11 px-8 w-full gap-2"
              >
                <FcGoogle size={18} />
                <span>Masuk dengan Google</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
