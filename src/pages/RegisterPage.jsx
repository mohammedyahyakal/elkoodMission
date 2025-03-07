import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(3, "يجب أن يكون الاسم 3 أحرف"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن المرور 6 أحرف"),
  role: z.enum(["user", "organization"]),
});

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // إرسال البيانات إلى الخادم
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const newUser = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/register`,
        data
      );
      setTimeout(() => {
        nav("/login", { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          تسجيل مستخدم جديد
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">اسم المستخدم</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block">البريد الإلكتروني</label>
            <input
              {...register("email")}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block">كلمة المرور</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block">نوع المستخدم</label>
            <select {...register("role")} className="w-full p-2 border rounded">
              <option value="user">شخص عادي</option>
              <option value="organization">فعالية</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "جاري انشلء حساب" : "انشاء حساب"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            لديك حساب؟{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
