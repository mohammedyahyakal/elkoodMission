import { useQuery } from "@tanstack/react-query";
import Cookies from "cookie-universal";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";

const cookies = new Cookies();
const fetchJobs = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/jobs`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
function OrganaizationPage() {
  const [oppenPopup, setOppenPopUp] = useState(false);
  const [id, setId] = useState("");
  const { data } = useQuery({
    queryKey: ["jobs"], // يجب أن يكون queryKey مصفوفة
    queryFn: fetchJobs,
  });
  const handeleClick = (id) => {
    setId(id);
    setOppenPopUp(true);
  };
  const filteredData = data?.filter(
    (item) => item.postedBy._id === cookies.get("id")
  );
  return (
    <div className="relative">
      {oppenPopup && (
        <Popup open={oppenPopup} setOppenPopUp={setOppenPopUp} id={id} />
      )}
      <h1 className="text-center my-5 text-blue-600 font-bold text-3xl">
        فرص العمل
      </h1>
      <div className="hidden md:block">
        <table className="w-full bg-white border border-gray-300  ">
          <thead>
            <tr className="bg-blue-600">
              <th className="py-3 px-4 border-b text-center">عنوان الوظيفة</th>
              <th className="py-3 px-4 border-b  text-center">عدد الساعات</th>
              <th className="py-3 px-4 border-b  text-center">المدينة</th>
              <th className="py-3 px-4 border-b  text-center">الوصف</th>
              <th className="py-3 px-4 border-b  text-center">الفعالية</th>
              <th className="py-3 px-4 border-b  text-center">تاريخ النشر</th>
              <th className="py-3 px-4 border-b  text-center">
                تقدم الى الوظيفة
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b text-center">{item.title}</td>
                <td className="py-3 px-4 border-b text-center">{item.hours}</td>
                <td className="py-3 px-4 border-b text-center">{item.city}</td>
                <td className="py-3 px-4 border-b text-center">
                  <div className="group relative">
                    <span className="truncate">
                      {item.description.slice(0, 20)}...{" "}
                      {/* عرض أول 20 حرفًا */}
                    </span>
                    <div className="absolute hidden group-hover:block bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                      {item.description} {/* عرض النص الكامل عند التمرير */}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {item.postedBy?.name || "Unknown"}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b flex justify-center">
                  <butttn
                    onClick={() => handeleClick(item._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
                  >
                    <FaPaperPlane className="mr-2" />
                    رؤية المتقدمين
                  </butttn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="block md:hidden">
        {filteredData?.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-4 border border-gray-300 rounded-lg"
          >
            <div className="font-semibold my-1">Title: {item.title}</div>
            <div className="my-1">Hours: {item.hours}</div>
            <div className="my-1">City: {item.city}</div>
            <div className="my-1">
              Description: {item.description.slice(0, 2)}
            </div>
            <div className="my-1">
              Posted By: {item.postedBy?.name || "Unknown"}
            </div>
            <div className="my-1">
              Created At: {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="my-1">
              <butttn
                onClick={() => handeleClick(item._id)}
                className="w-[200px] bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
              >
                <FaPaperPlane className="mr-2" />
                رؤية المتقدمين
              </butttn>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center my-8">
        <Link
          to={"/post-job"}
          className="text-center w-[200px] bg-blue-500 text-white px-4 py-2 rounded-lg text-xl font-bold hover:bg-blue-600 transition duration-300"
        >
          نشر فرصة عمل
        </Link>
      </div>
    </div>
  );
}

export default OrganaizationPage;
