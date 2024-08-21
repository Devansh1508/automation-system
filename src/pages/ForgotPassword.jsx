import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/slices/authSlice";
import { errorMessage, notify } from "../utils/Popup";
import { ToastContainer, toast } from "react-toastify";
import './css/spinner.css'
import './css/style.css'

const ForgotPassword = () => {

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email){
        errorMessage("Email is required");
        return;
    }
    // if email will be sent then we will send the emailSent flag will be set as true
    dispatch(setLoading(true));
    try {
    console.log("email:", email);
      const  data={email}
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/resetPasswordToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseBody = await response.json();
      errorMessage(responseBody.message);

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

        if(response.ok){ notify("Reset Email Sent");
          setEmailSent(true);}
          else errorMessage(responseBody.message);

    } catch (error) {
      console.log("email", email);
      errorMessage("Failed to reset password");
      console.log("RESET PASSWORD TOKEN Error", error);
      //   toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };

  useEffect(()=>{
    console.log("email", email);
    },[email]
  )

  return (
    <div className="flex flex-col items-center justify-center w-[100vw] h-[100vh] font-[Oswald]">
      <div className="w-[40vw] bg-[#EFF3F6] shadow-2xl h-[50vh] border-2 border-[#E7E7E7] p-5 rounded-md">
        {loading ? (
            <div className="flex h-[100%] w-[100%] items-center justify-center">
                <div class="spinner"></div>
            </div>
        ) : (
          <div>
            <h1 className="text-3xl flex justify-center my-4">
              {!emailSent ? "Reset your password" : "Check your email"}
            </h1>
            <p className="text-xl flex justify-center">
              {!emailSent
                ? "Have no fear, we will send you the instruction to reset your password"
                : `check your email for the reset link ${email}`}
            </p>
            <form onSubmit={handleSubmit}>
              {!emailSent && (
                <label>
                  <p className="text-lg my-2">Email Address</p>
                  <input
                    class=".styling"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </label>
              )}
              <button
                type="submit"
                className="bg-[#D3AD18] my-4 flex items-center justify-center p-2 rounded-md hover:scale-90 transition-all duration-300"
              >
                {!emailSent ? "reset password" : "resend email"}
              </button>
            </form>
            <ToastContainer />

            <div className="underline-offset-1 underline">
              <Link to="/login">
                <p>back to login</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
