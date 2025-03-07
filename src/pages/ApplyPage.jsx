import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(3, "يجب أن يكون  3 أحرف"),
  phone: z.string().min(10, "رقم الهاتف يجب أن  10 أرقام"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  cvFile: z.any(), // يمكنك إضافة تحقق إضافي هنا
});

const ApplyPage = () => {
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const { jobId } = useParams();
  const handleFileChange = (e) => {
    setResume(e.target.files[0]); // حفظ الملف المختار
  };
  const onSubmit = async (data) => {
    console.log(data.name, data.phone, data.email);
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("applicantName", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("resume", resume); // إضافة الملف إلى FormData
    console.log(formData);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/applications`, {
        method: "POST",
        body: formData, // إرسال FormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        toast.success("تم تقديم الطلب");
      } else {
        toast.error("فشل في التقديم.");
      }
    } catch (error) {
      toast.error("فشل في التقديم.");
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col gap-5 p-8 rounded-lg shadow-lg w-full max-w-md">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="text-2xl font-bold mb-4 text-center">التقدم للوظيفة</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">اسم المتقدم</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block">رقم الهاتف</label>
            <input
              {...register("phone")}
              className="w-full p-2 border rounded"
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
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
            <label className="block">ملف السيرة الذاتية</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            تقديم الطلب
          </button>
        </form>
        <Link
          className="w-full p-2 bg-blue-500 text-white rounded text-center"
          to={"/user-page"}
        >
          {" "}
          العودة الى الخلف
        </Link>
      </div>
    </div>
  );
};

export default ApplyPage;
