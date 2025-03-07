import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "cookie-universal";

const cookies = new Cookies();

const schema = z.object({
  title: z.string().min(3, "يجب أن يكون المسمى الوظيفي 3 أحرف"),
  hours: z.coerce
    .number({
      required_error: "يجب تحديد ساعات العمل",
      invalid_type_error: "يجب أن تكون ساعات العمل رقماً",
    })
    .min(1, "يجب أن تكون ساعات العمل أكبر من الصفر")
    .max(12, "يجب أن لا تكون ساعات العمل أكثر من 12 ساعة "),
  city: z.string().min(1, "يجب تحديد المدينة"),

  description: z.string().min(10, "يجب أن يكون وصف العمل 10 أحرف"),
});

const PostJobPage = () => {
  console.log(cookies.get("token"));
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);

    // إرسال البيانات إلى الخادم
    try {
      setLoading(true);
      const newJob = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/jobs`,
        data,
        {
          headers: {
            Authorization: cookies.get("token"),
          },
        }
      );
      toast.success("تم النشر");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">نشر فرصة عمل</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">المسمى الوظيفي</label>
            <input
              {...register("title")}
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label className="block">ساعات العمل</label>
            <input
              {...register("hours")}
              className="w-full p-2 border rounded"
            />
            {errors.hours && (
              <p className="text-red-500">{errors.hours.message}</p>
            )}
          </div>
          <div>
            <label className="block">المدينة</label>
            <input
              {...register("city")}
              className="w-full p-2 border rounded"
            />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block">وصف العمل</label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "جاري النشر" : "نشر"}
          </button>
        </form>
      </div>
      <div className="flex justify-center my-8">
        <Link
          className="text-center w-[200px] bg-blue-500 text-white px-4 py-2 rounded-lg text-xl font-bold hover:bg-blue-600 transition duration-300"
          to={"/org-page"}
        >
          الرجوع الى الخلف{" "}
        </Link>
      </div>
    </div>
  );
};

export default PostJobPage;
