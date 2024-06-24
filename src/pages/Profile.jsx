import React from "react";
import './css/profile.css'
import Card from "../components/profile/Card";
import Button from "../components/profile/Button";
import { useEffect } from "react";
import { useSelector } from "react-redux";


const Profile = () => {

  const {user} =useSelector((state))

  useEffect(()=>{
    getUserDetails();
  },[])

  const getUserDetails=async ()=>{
    const response = await fetch("http://localhost:4000/api/v1/profile/getUserDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response:",response.cookies);
  }

  return (
      <div className="w-[100vw] h-[100vh]">
      <div className="w-[100vw] h-[70vh] flex flex-col">
        <div className="w-[100vw] h-[100%] bg-[rgb(0,10,48)] flex justify-center">
          <div className="w-10/12 h-10/12 flex flex-row my-[9vh] justify-between">
            <div className="bg-white h-[20vw] w-[20vw] rounded-full border-2 border-[#E8E8E0]">
              <img src={user?.image} alt="" />
            </div>
            <div className="w-[60vw] h-[20vw]">
              <div className="text-white h-[30%] w-[100%] flex flex-row justify-between  p-4">
                <p id="name" className="title duration-300 hover:scale-110 transition-all text-3xl font-Playwrite+NZ" >Devansh Pratap</p>
                <div className="duration-300 hover:scale-110 transition-all flex-col gap-1 p-8 w-[7vw] mx-4 rounded-md flex items-center justify-center text-white bg-[#212c54e7]"><p className=" text-[#e9e3e3d7]">post</p><p id="accountType">HOD</p></div>
              </div>
              <div className="gap-4 flex flex-wrap my-8  h-[70%] w-[100%]">
                <Card title="Email" data="Email"/>
                <Card title="mobileNumber" data="mobileNumber"/>
                <Card title="totalLeaves" data="totalLeaves"/>
                <Card title="totalPost" data="totalPost"/>
              </div>
              <div className="flex">
              <Button color={"#AA0101"} text={"Edit Profile"}/>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100px] h-[100px] bg-[black] absolute top-[65vh]"></div>
      </div>
      <div></div>
    </div>
  );
};

export default Profile;
