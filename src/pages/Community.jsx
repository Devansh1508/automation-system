import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import { useSelector } from "react-redux";
import { errorMessage } from "../utils/Popup";
import "./css/style.css";
import { Link } from "react-router-dom";
// import Table from "../components/community/Table";

const Community = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/profile/getAllUsers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const data = await response.json();

      if (data.success) {
        console.log("data:", data.data);
        setUsers(data.data);
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
      <div className=" p-4">
        <h1 className="text-2xl font-semibold mb-4 flex justify-center">
          User List
        </h1>
        <div className="flex flex-wrap justify-center">
          {users.map((user) => (
            <Link to={`./userData/${user._id}`}>
              <div className="p-5  min-w-[25vw] min-h-[25vh] overflow-hidden m-5 border-2 border-[black] flex items-center justify-center rounded-lg flex-col">
                <div className="circle m-3 bg-black w-[6vw] h-[6vw] flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover rounded-full opacity-85 hover:opacity-100"
                    src={user?.image}
                    alt=""
                  />
                </div>
                <div>
                  <p className="font-bold">
                    {user?.firstName + " " + user?.lastName}
                  </p>
                </div>
                <div className="flex flex-wrap">
                  <p className="text-[#545454] flex flex-wrap">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[#545454]">
                    leaves: {user?.recentMonthLeaveCount}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
