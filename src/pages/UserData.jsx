import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import { errorMessage } from "../utils/Popup";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeaveCard from "../components/community/LeaveCard";
import Card from "../components/profile/Card";
import { ToastContainer } from "react-toastify";
import "./css/profile.css";
import getMonthlyLeaves from "../utils/UserData";
import {numberToMonth} from "../utils/UserData";

const UserData = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    getUserData();
    getAllLeaves();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/profile/getApplicantDetails/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const parseRes = await response.json();
      if (parseRes.success) {
        setUserData(parseRes.data);
      } else {
        errorMessage(parseRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllLeaves = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/getUserLeaveRequests/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const parseRes = await response.json();
      if (parseRes.success) {
        setLeaves(parseRes.data);
      } else {
        errorMessage(parseRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="w-[100vw] h-[70vh] flex flex-col shadow-2xl">
        <div className="profile w-[100vw] h-[100%] bg-[rgb(0,10,48)] flex justify-center">
          <div className="w-10/12 h-10/12 flex flex-row my-[9vh] justify-between">
            <div className="flex items-center justify-center h-[20vw] w-[20vw] rounded-full border-2 border-[#E8E8E0]">
              <img
                className="h-[20vw] w-[20vw] p-1 rounded-full"
                src={userData?.image}
                alt=""
              />
            </div>
            <div className="w-[60vw] h-[20vw]">
              <div className="text-white h-[30%] w-[100%] flex flex-row justify-between  p-4">
                <p
                  name="name"
                  className="title duration-300 hover:scale-110 transition-all text-3xl font-Playwrite+NZ"
                >
                  {userData?.firstName + " " + userData?.lastName}
                </p>
                <div className="duration-300 hover:scale-110 transition-all flex-col gap-1 p-8 w-[7vw] mx-4 rounded-md flex items-center justify-center text-white bg-[#212c54e7]">
                  <p className=" text-[#e9e3e3d7]">post</p>
                  <p name="accountType">{userData?.accountType}</p>
                </div>
              </div>
              <div className="gap-4 flex flex-wrap my-8  h-[70%] w-[100%]">
                <Card title="Email" data={userData?.email} />
                <Card title="Mobile Number" data={userData?.mobileNumber} />
                <Card
                  title="Remaining paid leaves"
                  data={userData?.totalLeaves}
                />
                <Card title="Unpaid Leaves" data={userData?.unpaidLeaves} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {console.log(leaves)}

      {leaves.map((leaveData, index) => (
        <div key={index}>
          <div className="flex justify-between">
          <div><p className="text-3xl p-10 font-bold">{numberToMonth(leaveData[0])}</p></div>
          <div><p className="text-3xl p-10"><span className="font-bold">Total Leaves:</span> {getMonthlyLeaves(leaveData)}</p></div>
          </div>
          <div className="flex gap-3"> 
          {leaveData[1].map((leave, innerIndex) => (
            <div key={innerIndex} >
              <LeaveCard leave={leave} />
            </div>
          ))}
          </div>
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default UserData;
