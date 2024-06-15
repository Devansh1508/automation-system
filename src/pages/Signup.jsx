import React, { useEffect } from "react";
import img1 from "../assets/images/Login/pic-1.jpg";
import img2 from "../assets/images/Login/pic-2.jpg";
import img3 from "../assets/images/Login/pic-3.jpg";
import img4 from "../assets/images/Login/pic-4.jpg";
import img5 from "../assets/images/Login/pic-5.jpg";
import img6 from "../assets/images/Login/pic-6.jpg";
import { useForm } from "react-hook-form";
import { useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';

const arr = [img1, img2, img3, img4, img5, img6];
const randomImg = arr[Math.floor(Math.random() * arr.length)];

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    // otp: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    accountType: "",
  });

  const registerUser = async (data, e) => {
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:4000/api/v1/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // notification
      if(response.ok)notify();
      else {
        const responseBody = await response.json();
        errorMessage(responseBody.message);
      }
      
      console.log("res:", response);
    } catch (err) {
      console.log("register/signup", err);
    }
  };

  useEffect(() => {
    console.log("from use ref", user);
  }, [user]);

  const onSubmit = async (data, e) => {
    await setUser({ ...data });
    await registerUser(data, e);
    console.log("user", user);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const notify = () => toast.success('🎉 Signup successfull!', {
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

    const errorMessage = (message)=> toast.error(`${message}`, {
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
    <div className="flex justify-center items-center">
      <div className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-[60vw] h-[70vh] border-[4px] shadow-2xl rounded-3xl flex bg-[#F2F5F8] flex-row overflow-hidden max-[600px]:w-[80vw]">
          <div
            className="w-[50%] h-[100%] shadow-2xl max-[800px]:w-[40%] max-[600px]:w-[0%]"
            style={{ background: `url(${randomImg})`, backgroundSize: "cover" }}
          ></div>
          <div className="flex flex-col justify-center items-center w-[50%] h-[100%] max-[800px]:w-[60%] max-[600px]:w-[100%]">
            <h1 className="text-[3rem] font-[Pacifico] m-4 max-[800px]:text-[2rem]">
              Sign Up
            </h1>

            {/* form  */}
            <div>
              <form
                action=""
                className="flex flex-col font-[Oswald] max-[800px]:text-[12px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <select {...register("accountType",{required})}>
          <option value="HOD">HOD</option>
          <option value="Registrar">Registrar</option>
          <option value="Other">Other</option>
        </select>

                <input
                  className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
                  type="text"
                  // onChange={handleChange}
                  {...register("firstName", { required: true })}
                  placeholder="firstName"
                />

                <input
                  className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
                  type="text"
                  // onChange={handleChange}
                  {...register("lastName", { required: true })}
                  placeholder="lastName"
                />

                <input
                  className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
                  type="email"
                  // onChange={handleChange}
                  {...register("email", { required: true })}
                  placeholder="email"
                />

                {/* <input
          className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
          type="text"
          // onChange={handleChange}
          {...register("otp", { required: true })}
          placeholder="otp"
        /> */}

                <input
                  className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
                  type="password"
                  // onChange={handleChange}
                  {...register("password", { required: true })}
                  placeholder="password"
                />

                <input
                  className="m-1 border-2 flex justify-center items-center p-[1px] rounded-xl"
                  type="password"
                  // onChange={handleChange}
                  {...register("confirmPassword", { required: true })}
                  placeholder="confirmPassword"
                />

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
    </div>
  );
};

export default Signup;
