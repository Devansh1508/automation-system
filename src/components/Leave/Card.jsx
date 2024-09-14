import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MyRequestStatus from "../common/MyRequestStatus";

const formatDate = (date) => new Date(date).toLocaleDateString();

const onEdit = () => {
  console.log("Edit button clicked");
};

const onDelete = () => {
  console.log("Delete button clicked");
};

const Card = (leave) => {
  const { user } = useSelector((state) => state.profile);

  // certain approvals 
  const renderApprovedByHOD = () => {
    if ((user.accountType === "Assistant Registrar" || user.accountType==="Other") && leave.leave.statusHOD) {
      return (
        <p className="text-gray-700 text-base">
          <strong>Approved By HOD:</strong> {leave.leave.approvedByHOD}
        </p>
      );
    }
    return null;
  };

  const renderApprovedByRegistrar = () => {
    if (
      user.accountType === "Assistant Registrar" &&
      leave.leave.statusRegistrar
    ) {
      return (
        <p className="text-gray-700 text-base">
          <strong>Approved By Registrar:</strong>
          {leave.leave.approvedByRegistrar}
        </p>
      );
    }
    return null;
  };

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
          {renderApprovedByHOD()}
          {renderApprovedByRegistrar()}
          <MyRequestStatus leave={leave} />
        </div>
      </Link>
    </div>
  );
};

export default Card;
