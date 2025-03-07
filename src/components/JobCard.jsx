import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-600">{job.city}</p>
      <p className="text-gray-600">{job.hours}</p>
      <p className="text-gray-600">{job.description}</p>
      <Link
        to={`/apply/${job._id}`}
        className="mt-2 p-2 bg-blue-500 text-white rounded block text-center"
      >
        التقدم للوظيفة
      </Link>
    </div>
  );
};

export default JobCard;
