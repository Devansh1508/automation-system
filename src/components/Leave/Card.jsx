import React from "react";
import { Link } from "react-router-dom";  

const formatDate = (date) => new Date(date).toLocaleDateString();

const onEdit = () => {
  console.log("Edit button clicked");
};

const onDelete = () => {
  console.log("Delete button clicked");
};

const Card = (leave) => {
  return (
    <div>
      <Link to={`/EditLeave/${leave.leave._id}`}>
        <div className="rounded m-4 block w-[30vw] shadow-lg p-4 bg-[#f1f0f0] transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="font-bold text-xl mb-2">{leave.leave.nature}</div>
          <p className="text-gray-700 text-base">
            <strong>Period:</strong> {leave.leave.period}
          </p>
          <p className="text-gray-700 text-base">
            <strong>From:</strong> {formatDate(leave.leave.fromDate)}
          </p>
          <p className="text-gray-700 text-base">
            <strong>To:</strong> {formatDate(leave.leave.toDate)}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Reason:</strong> {leave.leave.grounds}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Applied On:</strong> {formatDate(leave.leave.createdAt)}
          </p>
          <p
            className={`text-base ${
              leave.leave.approved ? "text-green-500" : "text-red-500"
            }`}
          >
            <strong>Status:</strong>{" "}
            {leave.leave.approved ? "Approved" : "Not Approved"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
