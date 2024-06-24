import React from "react";
import "./css/spinner.css";
import { useState } from "react";
import "./css/style.css";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { errorMessage, notify } from "../utils/Popup";
import { useLocation,useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nav,setNav]=useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const [submit,setSubmit]=useState(false) 
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(nav){
        navigate("/login");
      }
    }, 2000); 
  
    return () => clearTimeout(timeoutId);
  }, [nav])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token=location.pathname.split("/").at(-1);
      const data = { password, confirmPassword,token};
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseBody = await response.json();
      if (responseBody.success === true) {
        notify("Password updated successfully");
        setNav(true)

      } else {
        errorMessage(responseBody.message);
      }
    } catch (error) {
      errorMessage("Failed to update password");
      console.log("Failed to update password", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex h-[100%] w-[100%] items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex font-[oswald] w-[100vw] h-[100vh] items-center justify-center">
          <div className="border-4 bg-[#EFF3F6] shadow-2xl border-[#e2e0e0] w-[35vw] flex flex-col p-5 rounded-lg h-[50vh]">
            <h1 className=" text-3xl flex justify-center my-4">
              Create new password
            </h1>
            <p className="text-xl flex justify-center">
              Almost done, enter your new password
            </p>
            <form onSubmit={handleSubmit}>
              <label>
                <p className="text-lg my-2">New password</p>
                <input
                  className="styling"
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                <p className="text-lg my-2">Confirm password</p>
                <input
                  className="styling"
                  type="Password"
                  name="confirm password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              {
                !nav && (
                  <button
                type="submit"
                className="bg-[#D3AD18] my-4 flex items-center justify-center p-2 rounded-md hover:scale-90 transition-all duration-300"
              >
                {submit ? "" : "Change password"}
              </button>
                )
              }
            </form>
            <ToastContainer />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
