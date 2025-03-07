// src/components/RegisterForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "يجب أن يكون الاسم至少 3 أحرف"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون至少 6 أحرف"),
  userType: z.enum(["person", "organization"]),
});

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // إرسال البيانات إلى الخادم
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">اسم المستخدم</label>
        <input
          {...register("username")}
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div>
        <label className="block">البريد الإلكتروني</label>
        <input {...register("email")} className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
        <select {...register("userType")} className="w-full p-2 border rounded">
          <option value="person">شخص عادي</option>
          <option value="organization">فعالية</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        تسجيل
      </button>
    </form>
  );
};

export default RegisterForm;
