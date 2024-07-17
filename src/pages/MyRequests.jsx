import React, { useEffect,useState } from "react";
import Navbar from "../components/common/Navbar";
import { errorMessage } from "../utils/Popup";
import { useSelector } from "react-redux";
import Card from "../components/Leave/Card";
import { useLocation } from "react-router-dom";
import noLeave from "../assets/images/Leave/noLeave.svg"

const MyRequests = () => {
  const location=useLocation();
  const { token } = useSelector((state) => state.auth);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getLeaves();
  }, []);

  const getLeaves = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/leaves/getMyleave",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("response:", data);
      
      if (data.success) {
        console.log("data:", data.data);
        setLeaves(data.data);
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
      {
        leaves.length === 0 && (
          <div className="flex items-center justify-center w-[100vw] h-[90vh] flex-col">
            <div className="font-medium font-[oswald] text-xl"> No leave applications found</div>
            <div className="w-[40vw]">
              <img src={noLeave} alt="" />
            </div>
          </div>
        )
      }
      {
        leaves.length !== 0 && (
          <div>
            <div className="flex absolute items-center justify-center w-[100vw] h-[90vh] flex-col">
            {/* <div className="font-medium font-[oswald] text-xl"> No leave applications found</div> */}
            <div className="w-[40vw] opacity-30">
              <img src={noLeave} alt="" />
            </div>
          </div>
        
      <div className="flex flex-wrap">
      {leaves.map((leave) => (
        <Card key={leave._id} leave={leave} />
      ))}
      </div>
          </div>)
    }
    </div>
  );
};

export default MyRequests;
