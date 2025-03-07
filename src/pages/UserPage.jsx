import { FaPaperPlane } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const fetchUsers = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}api/jobs`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
function UserPage() {
  const [hours, setHours] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [descrebtion, setDescreption] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["jobs"], // يجب أن يكون queryKey مصفوفة
    queryFn: fetchUsers,
  });
  useEffect(() => {
    const filtered = data?.filter((item) => {
      const matchesName = item.city
        .toLowerCase()
        .startsWith(city.toLowerCase());
      const matHours = item.hours.includes(hours);
      const matTitle = item.title.includes(name);
      const matdesc = item.description.includes(descrebtion);
      return matchesName && matHours && matTitle && matdesc;
    });

    setFilteredData(filtered);
  }, [city, hours, name, descrebtion, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="w-full">
        <h1 className="text-center text-3xl font-bold text-blue-600 my-5">
          فرص العمل المتاحة
        </h1>
        <div className="my-5 flex justify-between max-w-[800px] m-auto">
          <input
            className="rounded-md outline-none  border-blue-600 border-2 w-[300px] py-1 px-2 focus:border-[3px] "
            type="text"
            placeholder="اختر المدينة"
            onChange={(e) => {
              setCity(e.target.value);
            }}
            value={city}
          />
          <input
            className="rounded-md outline-none  border-blue-600 border-2 w-[300px] py-1 px-2 focus:border-[3px] "
            type="number"
            placeholder="عدد ساعات العمل"
            onChange={(e) => {
              setHours(e.target.value);
            }}
            value={hours}
          />
        </div>
        <div className="my-5 flex justify-between max-w-[800px] m-auto">
          <input
            className="rounded-md outline-none  border-blue-600 border-2 w-[300px] py-1 px-2 focus:border-[3px] "
            type="text"
            placeholder="العنوان الوظيفي"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <input
            className="rounded-md outline-none  border-blue-600 border-2 w-[300px] py-1 px-2 focus:border-[3px] "
            type="text"
            placeholder="وصف العمل"
            onChange={(e) => {
              setDescreption(e.target.value);
            }}
            value={descrebtion}
          />
        </div>
        {/* الجدول للشاشات الكبيرة */}
        <div className="hidden md:block">
          <table className="w-full bg-white border border-gray-300  ">
            <thead>
              <tr className="bg-blue-600">
                <th className="py-3 px-4 border-b text-center">
                  عنوان الوظيفة
                </th>
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
                  <td className="py-3 px-4 border-b text-center">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {item.hours}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {item.city}
                  </td>
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
                    <Link
                      to={`/apply/${item._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
                    >
                      <FaPaperPlane className="mr-2" />
                      التقدم إلى الوظيفة
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* تصميم بديل للشاشات الصغيرة */}
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
                <Link
                  to={`/apply/${item._id}`}
                  className="w-[200px] bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-300"
                >
                  <FaPaperPlane className="mr-2" />
                  التقدم إلى الوظيفة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserPage;
