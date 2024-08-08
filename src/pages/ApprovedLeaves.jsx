import React, { useEffect, useState } from "react";
import Card from "../components/approvedLeaves/Card";
import Navbar from "../components/common/Navbar";
import { errorMessage } from "../utils/Popup";
import { useSelector } from "react-redux";
import noLeave from "../assets/images/Leave/noLeave.svg";

const Registrar = () => {
  const [leave, setLeave] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    getApprovedLeaves();
  }, []);

  const getApprovedLeaves = async () => {
    try {
      console.log("hello");
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/getApprovedLeaves`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("data:", data.data);

      if (data.success) {
        setLeave(data.data);
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  };

  return (
    <div>
      <Navbar />
      {leave.length > 0 ? (
        <div className="flex flex-wrap">
          {leave.map((leave) => (
            <div className="flex flex-col" key={leave[0]}>
              <div className="font-bold ">{leave[0]}
              <div className="flex flex-wrap">
                {leave[1].map((leaveData) => (
                  <Card key={leaveData._id} leave={leaveData} />
                ))}
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[70vh] w-[100vw] flex flex-col items-center justify-center">
          <div className="font-bold">
            <p>No Leave found</p>
          </div>
          <div className="h-[40vh] w-[40vw] opacity-80 hover:opacity-100">
            <img src={noLeave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrar;
