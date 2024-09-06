import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { useSelector } from "react-redux";
import Card from "../components/HOD/Card";
import pendingApprovals from "../assets/images/pending approval/pendingApprovals.svg";

const AllLeaves = () => {
  const { user } = useSelector((state) => state.profile);
  const [leaveData, setLeaveData] = useState([]);

  const id = user._id;

  useEffect(() => {
    getAllLeaves();
  }, []);

  const getAllLeaves = async () => {
    try {
      // selecting the api based on the account type of the user
      let api;
      if(user.accountType==="HOD"){
        api=`http://localhost:4000/api/v1/leaves/pendingApprovalHOD`
      } 
      else if(user.accountType==="Registrar"){
        api=`http://localhost:4000/api/v1/leaves/pendingApprovalRegistrar`
      }
      else if(user.accountType==="Director"){
        api=`http://localhost:4000/api/v1/leaves/pendingApprovalDirector`
      }

      const response = await fetch(
        `${api}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // console.log(data);
        setLeaveData(data.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div>
      <Navbar />
      {console.log(leaveData)}
      {leaveData.length === 0 && (
        <div className="flex items-center justify-center w-[100vw] h-[90vh] flex-col">
        <div className="font-medium font-[oswald] text-xl"> No leave applications found</div>
        <div className="w-[40vw]">
          <img src={pendingApprovals} alt="" />
        </div>
      </div>
      )  
      }
      <div className="flex flex-wrap">
        {leaveData&&(
          leaveData.map((leave) =>(
             <Card key={leave._id} leave={leave} />
          )))
        }
      </div>
    </div>
  );
};

export default AllLeaves;
