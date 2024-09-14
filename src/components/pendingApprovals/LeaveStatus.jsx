import React from 'react'
import { useSelector } from 'react-redux'

const LeaveStatus = ({leave}) => {
    const { user } = useSelector((state) => state.profile);
  return (
    <div>
      {(user.accountType==="HOD")&&(<p
            className={`text-base ${
              (user.accountType === "HOD") &&
              leave.leave.statusHOD ? "text-green-500" : "text-red-500"
            }`}>
            <strong>Status:</strong>
            {leave.leave.statusHOD ? "Approved" : "Not Approved"}
          </p>)}

      {
        user.accountType === "Director" && (
            <p
            className={`text-base ${
                    (user.accountType === "Director") &&
                    leave.leave.statusDirector ? "text-green-500" : "text-red-500"   
            }
            
            `}
          >
            <strong>Status:</strong>
            {leave.leave.statusDirector ? "Approved" : "Not Approved"}
          </p>
        )
      }

      {(user.accountType==="Registrar")&&(<p
            className={`text-base ${
                (user.accountType === "Registrar") &&
                leave.leave.statusRegistrar ? "text-green-500" : "text-red-500"
              }`}>
            <strong>Status:</strong>
            {leave.leave.statusRegistrar ? "Approved" : "Not Approved"}
          </p>)}
    </div>
  )
}

export default LeaveStatus