import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Status from "../components/Leave/Status";
import "./css/leaveForm.css";
import { notify, errorMessage } from "../utils/Popup";
import { ToastContainer } from "react-toastify";

const LeaveCard = () => {
  const { userId, leaveId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [applicant, setApplicant] = useState({});
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const [approve, setApprove] = useState(false);
  const [leave, setLeave] = useState({});
  const [HOD,setHOD]=useState();
  const [registrar,setRegistrar]=useState();
  const [director,setDirector]=useState();

  const currentTime = new Date();

  useEffect(() => {
    getLeaves();
  }, [approve]);

  const getLeaves = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/getLeave/${leaveId}`,
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
        setApplicant(data.data.userRequestedForLeave);
        setHOD(data.data.HOD)
        setDirector(data.data.Director)
        setRegistrar(data.data.Registrar)
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  };

  const handleApprove = async () => {
    try {
      let api = ``;
      if (user.accountType === "HOD")
        api = `http://localhost:4000/api/v1/leaves/approveLeavebyHOD/user/${userId}/leave/${leaveId}`;
      else if (user.accountType === "Director")
        api = `http://localhost:4000/api/v1/leaves/approveLeavebyDirector/user/${userId}/leave/${leaveId}`;
      else if (user.accountType === "Registrar")
        api = `http://localhost:4000/api/v1/leaves/approveLeavebyRegistrar/user/${userId}/leave/${leaveId}`;
      const response = await fetch(api, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicant }),
      });
      const data = await response.json();
      console.log("data from api:", data);

      if (data.success) {
        if (data.status === true) {
          notify("Leave approved");
          setApprove(true);
        } else {
          notify("leave Disapproved");
          setApprove(false);
        }
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  };

  return (
    <div className="formBg w-[100vw]">
      <Navbar />
      <div className="w-[100vw] flex rounded overflow-hidden shadow-lg justify-center p-4">
        <div className="bgForm w-[80vw] rounded overflow-hidden shadow-lg p-6 bg-white">
          <div className="flex w-[100%] justify-between">
            <div
              className="flex w-
       justify-center"
            >
              <h2 className="text-2xl font-bold mb-4">Leave Details</h2>
            </div>

            {
              (user.accountType==="HOD")&&<Status leave={leave} status={leave.statusHOD}/>
            }
            {
              (user.accountType==="Registrar")&&<Status leave={leave} status={leave.statusRegistrar}/>
            }
            {
              (user.accountType==="Director")&&<Status leave={leave} status={leave.statusDirector}/>
            }

            
          </div>
          <br />
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">
              Applicant Name:
            </label>
            <p className="text-gray-700">
              {applicant.firstName + " " + applicant.lastName}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">
              Applicant Email:
            </label>
            <p className="text-gray-700">{applicant.email}</p>
          </div>
          {applicant.mobileNumber && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Mobile Number:
              </label>
              <p className="text-gray-700">{applicant.mobileNumber}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold">
              Applicant Post:
            </label>
            <p className="text-gray-700">{applicant.accountType}</p>
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
            <label className="block text-gray-700 font-bold">From Date:</label>
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
            <p className="text-gray-700">{leave.prefixSuffix ? "Yes" : "No"}</p>
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
            <label className="block text-gray-700 font-bold">Applied On:</label>
            <p className="text-gray-700">{formatDate(leave.createdAt)}</p>
          </div>

          {/* jisne approval diya  */}
          {leave.approvedByHOD != null && (
            <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Approved By HOD:
              </label>
              <p className="text-gray-700">{HOD.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                HOD email:
              </label>
              <p className="text-gray-700">{HOD.email}</p>
            </div>
            </div>
          )}

          {leave.approvedByRegistrar != null && (
            <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Approved By Registrar:
              </label>
              <p className="text-gray-700">{registrar.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Registrar email:
              </label>
              <p className="text-gray-700">{registrar.email}</p>
            </div>
            </div>
          )}

          {leave.approvedByDirector != null && (
            <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Approved By Director:
              </label>
              <p className="text-gray-700">{director.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                Director email:
              </label>
              <p className="text-gray-700">{director.email}</p>
            </div>
            </div>
          )}

          <div className="flex justify-between">
            <div>
              <button
                onClick={handleApprove}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveCard;
