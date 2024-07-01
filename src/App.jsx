import React from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import OtpGenerate from "./pages/OtpGenerate";
import OpenRoute from "./components/common/OpenRoute";
import { Routes, Route } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";
import LeaveForm from "./pages/LeaveForm";
import AppliedLeaves from "./pages/AppliedLeaves";
import EditLeave from "./pages/EditLeave";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/Signup"
          element={
              <Signup />
          }
        />
        <Route
          path="/LeaveForm"
          element={
            // <OpenRoute>
              <LeaveForm/>
            // </OpenRoute>
          }
        />
        <Route
          path="/Login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route path="/AppliedLeaves" element={<AppliedLeaves />} />
        <Route path="/Otp" element={<OtpGenerate />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route
          path="ForgotPassword"
          element={
              <ForgotPassword />
          }
        />
        <Route
          path="AppliedLeaves/:id"
          element={
              <EditLeave/>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <ChangePassword />
            </OpenRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
