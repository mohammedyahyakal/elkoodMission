import { useQuery } from "@tanstack/react-query";
import { Modal } from "flowbite-react";
import Cookies from "cookie-universal";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const cookies = new Cookies();

function Popup({ open, setOppenPopUp, id }) {
  const fetchApps = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}api/applications/${id}`,
      {
        headers: {
          Authorization: cookies.get("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };
  const { data, refetch } = useQuery({
    queryKey: ["app"], // يجب أن يكون queryKey مصفوفة
    queryFn: fetchApps,
  });
  const changeStatus = (status, id) => {
    try {
      axios.put(
        `${import.meta.env.VITE_BASE_URL}api/applications/status`,
        {
          applicationId: id, // Body: معرف الطلب
          status, // Body: الحالة الجديدة (accepted أو rejected)
        },
        {
          headers: {
            "Content-Type": "application/json", // نوع البيانات
            Authorization: cookies.get("token"), // التحقق باستخدام Token (إذا كان مطلوبًا)
          },
        }
      );
      toast.success("تم تعديل اللطلب");
      refetch(["app"]);
    } catch (erorr) {
      toast.error("حدث خطاء ما");
      console.log(erorr);
    }
  };
  console.log(data);
  return (
    <Modal
      className="bg-[rgb(0,0,0,0.5)] py-9"
      show={open}
      size="md"
      onClose={() => setOppenPopUp(false)}
      popup
    >
      <Modal.Header className="absolute top-11 right-9" />
      <Toaster position="top-center" reverseOrder={false} />
      <Modal.Body>
        <div className="bg-gray-100 p-4 ">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center my-6">
              بيانات المتقدمين
            </h1>
            <div className="grid grid-cols-1  gap-4">
              {data?.map((applicant, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    {applicant.applicantName}
                  </h2>
                  <div className="space-y-2">
                    <p className="flex flex-row-reverse justify-between">
                      <span className="font-medium ml-3">:تاريخ التقديم</span>{" "}
                      {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                    <p className="flex flex-row-reverse justify-between">
                      <span className="font-medium ml-3">
                        : البريد الإلكتروني
                      </span>{" "}
                      {applicant.email}
                    </p>
                    <p className="flex flex-row-reverse justify-between">
                      <span className="font-medium ml-3">:رقم الهاتف</span>{" "}
                      {applicant.phone}
                    </p>

                    <p className="flex flex-row-reverse justify-between ">
                      <span>:الحالة</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-sm ${
                          applicant.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : applicant.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {applicant.status === "pending"
                          ? "قيد المراجعة"
                          : applicant.status === "accepted"
                          ? "مقبول"
                          : "مرفوض"}
                      </span>
                    </p>
                    <p className="flex justify-center mb-10 py-3">
                      {" "}
                      <Link
                        className="ml-2 px-2 py-1 rounded-full text-sm bg-blue-600  text-white"
                        to={`${import.meta.env.VITE_BASE_URL}${
                          applicant.resume
                        }`}
                      >
                        <span className="font-medium">عرض السيرة الذاتية</span>
                      </Link>
                    </p>
                    <div className="flex justify-between mt-10">
                      <button
                        onClick={() => changeStatus("accepted", applicant._id)}
                        className="ml-2 px-2 py-1 rounded-full text-sm bg-green-600 text-white w-[120px]"
                      >
                        <span className="font-medium">قبول الطلب </span>
                      </button>
                      <button
                        onClick={() => changeStatus("rejected", applicant._id)}
                        className="ml-2 px-2 py-1 rounded-full text-sm bg-red-600 text-white  w-[120px]"
                      >
                        <span className="font-medium">رفض الطلب</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Popup;
