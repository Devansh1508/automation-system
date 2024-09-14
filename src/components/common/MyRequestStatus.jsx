import React from 'react'
import { useSelector } from 'react-redux'

const status = ({leave}) => {
    const { user } = useSelector((state) => state.profile);
  return (
    <div>
      <p
            className={`text-base ${
              (user.accountType === "HOD" &&(leave.leave.statusRegistrar ? "text-green-500" : "text-red-500")||
              user.accountType === "Registrar" &&(leave.leave.statusDirector ? "text-green-500" : "text-red-500")||
              user.accountType === "Assistant Professor" &&(leave.leave.statusRegistrar ? "text-green-500" : "text-red-500")||
              user.accountType === "Others" &&(leave.leave.statusRegistrar ? "text-green-500" : "text-red-500"))
            }`}
          >
            <strong>Status:</strong>{" "}
            {
            (user.accountType === "HOD" &&(leave.leave.statusHOD ? "Approved" : "Not Approved")||
            user.accountType === "Registrar" &&(leave.leave.statusRegistrar ? "Approved" : "Not Approved")||
            user.accountType === "Assistant Professor" &&(leave.leave.statusRegistrar? "Approved" : "Not Approved")||
            user.accountType === "Others" &&(leave.leave.statusRegistrar? "Approved" : "Not Approved"))
            }
          </p>
    </div>
  )
}

export default status
