import React from "react";
import img1 from "../assets/images/Login/pic-1.jpg";
import img2 from "../assets/images/Login/pic-2.jpg";
import img3 from "../assets/images/Login/pic-3.jpg";
import img4 from "../assets/images/Login/pic-4.jpg";
import img5 from "../assets/images/Login/pic-5.jpg";
import img6 from "../assets/images/Login/pic-6.jpg";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
const arr = [img1, img2, img3, img4, img5, img6];
const randomImg = arr[Math.floor(Math.random() * arr.length)];

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });

  useEffect(() => {
    // handleSubmit();
  }, [user]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log("data", data);
    await setUser({ ...data });
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    if (response.ok) notify();
    else {
      errorMessage(responseBody.message);
    }
    console.log("res:", responseBody.message);
  };

  const notify = () =>
    toast.success("🎉 Login successfull!", {
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

  // input styling
  const styling =
    "m-1 border-2 flex justify-center items-center p-[1px] rounded-xl";

  return (
    <div className="flex justify-center items-center">
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-[60vw] h-[70vh] border-[4px] shadow-2xl rounded-3xl bg-[#EFF3F6] flex flex-row overflow-hidden max-[600px]:w-[80vw]">
          <div
            className="w-[50%] h-[100%] shadow-2xl max-[800px]:w-[40%] max-[600px]:w-[0%]"
            style={{ background: `url(${randomImg})`, backgroundSize: "cover" }}
          ></div>
          <div className="flex flex-col justify-center items-center w-[50%] h-[100%] max-[800px]:w-[60%] max-[600px]:w-[100%]">
            <h1 className="text-[3rem] font-[Pacifico] m-4 max-[800px]:text-[2rem]">
              Login
            </h1>

            <form
              action=""
              className="flex flex-col font-[Oswald] max-[800px]:text-[12px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className={styling}
                type="text"
                {...register("email")}
              />
              <input
                className={styling}
                type="password"
                {...register("password")}
              />
              <div className="flex text-sm underline-offset-1 underline justify-end w-[100%]">
                <Link to="/ForgotPassword">
                <p>Forgot password</p>
                </Link>
              </div>
              <input
                className="text-center transition-all duration-200 hover:scale-95 px-6 py-2 shadow-xl rounded-md onhover:scale-95 font-bold m-3 bg-[#E5A105]"
                disabled={isSubmitting}
                type="Submit"
                name="Submit"
              />
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
