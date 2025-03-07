import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "cookie-universal";

const cookies = new Cookies();

// تعريف Schema للتحقق من صحة البيانات باستخدام Zod
const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن  6 أحرف"),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const newUser = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/login`,
        data
      );
      toast.success("تم تسجيل الدخول");
      console.log(newUser);
      cookies.set("token", newUser.data.token);
      cookies.set("role", newUser.data.role);
      cookies.set("id", newUser.data.id);

      setTimeout(() => {
        nav(`/${cookies.get("role") === "user" ? "user-page" : "org-page"}`, {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("This didn't work.");

      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    // إرسال البيانات إلى الخادم لتسجيل الدخول
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center  ">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              {...register("email")}
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <input
              {...register("password")}
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول" : "تسجيل الدخول"}{" "}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              انشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
