import React from "react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import "./otp.css";
import otp from "../assets/images/otp.svg";
import { ToastContainer, toast, Flip } from "react-toastify";

const OtpGenerate = () => {
  const [user,setUser] = useState({email:""});

  const generateOtp = async (data,e) => {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:4000/api/v1/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });


      if (response.ok) {
        notify("Otp is successfully send");
      } else {
        const responseBody =await response.json();
        console.log("responseBody", responseBody);
        errorMessage(responseBody.message);
      }
    } catch (err) {
      console.log("err:", err);
      errorMessage("error while generating otp");
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit =async (data, e) => {
    await setUser({...data});
    await generateOtp(data,e);
  };

  const notify = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Flip,
    });

  const errorMessage = (message) =>
    toast.error(`${message}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Flip,
    });


  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      <div className="border-2 shadow-2xl rounded-md border-[#868589] w-[80vw] h-[80vh] flex items-center justify-center">
        <div className="w-[50%] h-[100%] flex items-center justify-center">
          <img src={otp} alt="" />
        </div>
        <div className=" w-[50%] h-[100%] flex flex-col items-center justify-center">
          <form
            className="flex flex-col p-[15px] items-center justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="font-bold text-[25px]">Generate OTP</h1>
            <input placeholder="EMAIL"  {...register("email",)} />
            <input className="bg-[#E9A246]" type="submit" />
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default OtpGenerate;
