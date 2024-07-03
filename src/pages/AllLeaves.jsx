import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { useSelector } from "react-redux";
import Card from "../components/HOD/Card";

const AllLeaves = () => {
  const { user } = useSelector((state) => state.profile);
  const [leaveData, setLeaveData] = useState(
    [
      {
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
      },
    ],
    []
  );

  const id = user._id;

  useEffect(() => {
    getAllLeaves();
  }, []);

  const getAllLeaves = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/leaves/getAllLeaves/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log(data);
        setLeaveData(data.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-wrap">
        {leaveData.map((leave) => (
          <Card key={leave._id} leave={leave} />
        ))}
      </div>
    </div>
  );
};

export default AllLeaves;
