import React from "react";
import "./css/profile.css";
import Card from "../components/profile/Card";
import Button from "../components/profile/Button";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading, setToken } from "../redux/slices/authSlice";
import { setUser } from "../redux/slices/profileSlice";
import { notify, errorMessage } from "../utils/Popup";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/common/Navbar";

const Profile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountType, setAccountType] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  useEffect(() => {
    getProfile();
    console.log("user",user)
  },[]);
  
  useEffect(() => {
    if(loading){
      getProfile();
      setLoading(false);
    }
  }, [loading]);

  const editClick = () => {
    setEditProfile(true);
  };

  const logoutClick = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    notify("Logged Out");
    navigate("/");
  };

  const getProfile = async () => {
    try {
      console.log("token", token);  
      const response = await fetch(
        "http://localhost:4000/api/v1/profile/getUserDetails",
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
        dispatch(setUser(data.data));
        setFirstName(data.data.firstName);
        setLastName(data.data.lastName);
        setMobileNumber(data.data.mobileNumber);
        setAccountType(data.data.accountType);
      } else {
        errorMessage(data.message);
        logoutClick();
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while fetching profile");
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/profile/updateProfile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            accountType,
            mobileNumber,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setEditProfile(false)
        console.log("loading");
        setLoading(true);
      } else {
        errorMessage(data.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while updating profile");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      <Navbar />
      {
        // update profile page
        editProfile && (
          <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center">
            <form
              className={`w-[50vw] h-[70vh] absolute flex justify-center items-center`}
            >
              <div className="bg-white p-8 rounded-md w-[40vw] h-[70vh] border-2 border-[]">
                <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
                <div className="mb-4">
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="Enter your first name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="Enter your last name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="post"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Post
                  </label>

                  <select
                    name="accountType"
                    value={accountType}
                    onChange={(e) => {
                      setAccountType(e.target.value);
                    }}
                  >
                    <option value="HOD">HOD</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Director">Director</option>
                    <option value="Registrar">Registrar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="mobileNumber"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={mobileNumber}
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="Enter your mobile number"
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    onClick={updateProfile}
                    className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded"
                  >
                    Update
                  </button>
                  
                  <button
                    onClick={editClick}
                    className="bg-[#AA0101] hover:bg-[#7f1717] text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
            <ToastContainer />
          </div>
        )
      }
      <div className="w-[100vw] h-[100vh] flex flex-col">
        <div className="w-[100vw] p-10 h-[10vh] flex justify-end bg-[rgb(0,10,48)]">
          <div onClick={logoutClick}>
            <Button color={"#AA0101"} text={"Logout"} />
          </div>
        </div>
        <div className="w-[100vw] h-[100%] bg-[rgb(0,10,48)] flex justify-center">
          <div className="w-10/12 h-10/12 flex flex-row my-[9vh] justify-between">
            <div className="flex items-center justify-center h-[20vw] w-[20vw] rounded-full border-2 border-[#E8E8E0]">
              <img
                className="h-[20vw] w-[20vw] p-1 rounded-full"
                src={user?.image}
                alt=""
              />
            </div>
            <div className="w-[60vw] h-[20vw]">
              <div className="text-white h-[30%] w-[100%] flex flex-row justify-between  p-4">
                <p
                  name="name"
                  className="title duration-300 hover:scale-110 transition-all text-3xl font-Playwrite+NZ"
                >
                  {user?.firstName + " " + user?.lastName}
                </p>
                <div className="duration-300 hover:scale-110 transition-all flex-col gap-1 p-8 min-w-[7vw] mx-4 rounded-md flex items-center justify-center text-white bg-[#212c54e7]">
                  <p className=" text-[#e9e3e3d7]">post</p>
                  <p>{user?.accountType}</p>
                </div>
              </div>
              <div className="gap-4 flex flex-wrap my-8  h-[70%] w-[100%]">
                <Card title="Email" data={user?.email} />
                <Card title="Mobile Number" data={user?.mobileNumber} />
                <Card title="Remaining paid leaves" data={user?.paidLeaves} />
                <Card title="Unpaid Leaves" data={user?.unpaidLeaves} />
              </div>
              <div className="flex">
                <div onClick={editClick}>
                  <Button color={"#AA0101"} text={"Edit Profile"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
