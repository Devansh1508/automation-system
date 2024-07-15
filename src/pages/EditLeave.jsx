import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { errorMessage } from "../utils/Popup";
import { useParams,useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Status from "../components/Leave/Status";
import "./css/leaveForm.css";
import { notify } from "../utils/Popup";

const LeaveCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate=useNavigate()
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const {user}=useSelector((state)=>state.profile)
  const [leave, setLeave] = useState({
    nature: "",
    period: "",
    fromDate: "",
    toDate: "",
    prefixSuffix: false,
    grounds: "",
    address: "",
    responsibilities: "",
    extraWorkDate: [],
    clCoAvailed: "",
    remark: "",
  });

  const [formData, setFormData] = useState({
    nature: "",
    period: "",
    fromDate: "",
    toDate: "",
    prefixSuffix: false,
    grounds: "",
    address: "",
    responsibilities: "",
    extraWorkDate: [],
    clCoAvailed: "",
    remark: "",
  });

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const getLeaves = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/getLeave/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setLeave(data.data.leave);
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/deleteLeave/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        notify("deleted")
        navigate("/myRequests")  
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  };
  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="formBg w-[100vw]">
      <Navbar />
      <div className="w-[100vw] flex rounded overflow-hidden shadow-lg justify-center p-4">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="nature"
              value={formData.nature}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="grounds"
              value={formData.grounds}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="bgForm w-[80vw] rounded overflow-hidden shadow-lg p-6 bg-white">
            <div className="flex w-[100%] justify-between">
              <div
                className="flex w-
       justify-center"
              >
                <h2 className="text-2xl font-bold mb-4">Leave Details</h2>
              </div>
              <Status leave={leave} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Nature of Leave:
              </label>
              <p className="text-gray-700">{leave.nature}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Period of Leave:
              </label>
              <p className="text-gray-700">{leave.period}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                From Date:
              </label>
              <p className="text-gray-700">{formatDate(leave.fromDate)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">To Date:</label>
              <p className="text-gray-700">{formatDate(leave.toDate)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Prefix/Suffix Sundays and Holidays:
              </label>
              <p className="text-gray-700">
                {leave.prefixSuffix ? "Yes" : "No"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Reason:</label>
              <p className="text-gray-700">{leave.grounds}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">Address:</label>
              <p className="text-gray-700">{leave.address}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Responsibilities:
              </label>
              <p className="text-gray-700">{leave.responsibilities}</p>
            </div>
            {leave.extraWorkDate && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">
                  Extra Work Date:
                </label>
                <p className="text-gray-700">{leave.extraWorkDate}</p>
              </div>
            )}
            {leave.clCoAvailed && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">
                  CL/CO Availed:
                </label>
                <p className="text-gray-700">{leave.clCoAvailed}</p>
              </div>
            )}
            {leave.remark && (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Remark:</label>
                <p className="text-gray-700">{leave.remark}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Applied On:
              </label>
              <p className="text-gray-700">{formatDate(leave.createdAt)}</p>
            </div>
            {
              !leave.approved&&(
                  <div className="flex justify-between">
              <div>
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Edit
                </button>
              </div>
              <div>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveCard;
