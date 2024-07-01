import React from "react";
import img1 from "../assets/images/Login/pic-1.jpg";
import img2 from "../assets/images/Login/pic-2.jpg";
import img3 from "../assets/images/Login/pic-3.jpg";
import img4 from "../assets/images/Login/pic-4.jpg";
import img5 from "../assets/images/Login/pic-5.jpg";
import img6 from "../assets/images/Login/pic-6.jpg";
import { useForm } from "react-hook-form";
import { useState,useEffect} from "react";
import { ToastContainer} from "react-toastify";
import { errorMessage,notify } from "../utils/Popup";
import { useNavigate,Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/profileSlice";
import { setToken } from "../redux/slices/authSlice";
const arr = [img1, img2, img3, img4, img5, img6];
const randomImg = arr[Math.floor(Math.random() * arr.length)];

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [nav,setNav]=useState(false)
  const {user}=useSelector((state)=>state.profile)
  const {token}=useSelector((state)=>state.auth)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if(nav){
  //       navigate("/profile");
  //     }
  //   }, 2000); 
  
  //   return () => clearTimeout(timeoutId);
  // }, [nav,user])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await setInput({ ...data });
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    if (response.ok){ 
      notify("🎉 Login successfull!");
      dispatch(setToken(responseBody.token))
      dispatch(setUser(responseBody.user))
      await localStorage.setItem("token", JSON.stringify(responseBody.token))
      await localStorage.setItem("user", JSON.stringify(responseBody.user))
    }
    else {
      errorMessage(responseBody.message);
    }
    console.log("res:", responseBody.message);
  };

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
              {
                !nav&&(
                  <input
                className="text-center transition-all duration-200 hover:scale-95 px-6 py-2 shadow-xl rounded-md onhover:scale-95 font-bold m-3 bg-[#E5A105]"
                disabled={isSubmitting}
                type="Submit"
                name="Submit"
              />
                )
              }
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
