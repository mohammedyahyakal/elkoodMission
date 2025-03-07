import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ApplyPage from "./pages/ApplyPage";
import PostJobPage from "./pages/PostJobPage";
import OrganaizationPage from "./pages/OrganaizationPage";
import UserPage from "./pages/UserPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ProtectedRoute from "./components/ProtectedRouts";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/apply/:jobId",
    element: (
      <ProtectedRoute>
        <ApplyPage />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/post-job",
    element: (
      <ProtectedRoute>
        <PostJobPage />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-page",
    element: (
      <ProtectedRoute>
        <UserPage />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/org-page",
    element: (
      <ProtectedRoute>
        <OrganaizationPage />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/login" />,
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />, // صفحة 404
  // },
]);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export default App;
