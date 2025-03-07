import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "cookie-universal";

const cookies = new Cookies();

export default function ProtectedRoute({ children }) {
  // قراءة الـ token من cookies
  const token = cookies.get("token");

  // إذا لم يكن هناك token، يتم تحويل المستخدم إلى صفحة التسجيل
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // إذا كان هناك token، يتم عرض الـ children
  return children;
}
