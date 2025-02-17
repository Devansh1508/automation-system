import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";  
import { useSelector } from "react-redux";

const formatDate = (date) => new Date(date).toLocaleDateString();

const Card = (leave) => {
    const { user } = useSelector((state) => state.profile);
    const [applicant, setApplicant] = useState({});
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        getUser();
    },[]);

    const getUser = async () => {
      try {
        if(leave.leave.user){
        const response = await fetch(
          `http://localhost:4000/api/v1/profile/getApplicantDetails/${leave.leave.user}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        // console.log("data:");
        if (data.success) {
          // console.log(data);
          setApplicant(data.data);
        }
      }
      } catch (err) {
        console.log("err:", err);
      }
    };

  return (
    <div>
      {/* {console.log("hello")} */}
      <Link to={`/AllLeaves/user/${user._id}/leave/${leave.leave._id}`}>
        <div className="rounded flex flex-col m-4 w-[30vw] shadow-lg p-4 bg-[#f1f0f0] transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <div className="font-bold text-xl mb-2">{leave.leave.nature}</div>
          <p className="text-gray-700 text-base">
            <strong>Period:</strong> {leave.leave.period}
          </p>
          <p className="text-gray-700 text-base">
            <strong>From:</strong> {formatDate(leave.leave.fromDate)}
          </p>
          <p className="text-gray-700 text-base">
            <strong>To:</strong> {formatDate(leave.leave.toDate)}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Reason:</strong> {leave.leave.grounds}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Applied On:</strong> {formatDate(leave.leave.createdAt)}
          </p>
          <br />
          <p className="text-gray-700 text-base">
            <strong>Applied By</strong> 
          </p>
          <p className="text-gray-700 text-base">
            <strong>Name: {applicant.firstName +" " + applicant.lastName}</strong> 
          </p>
          <p className="text-gray-700 max-xl:text-xs ">
            <strong>Email: {applicant.email}</strong> 
          </p>
          <p className="text-gray-700 text-base">
            <strong>post: {applicant.accountType}</strong> 
          </p>
          <p
            className={`text-base ${
              (user.accountType === "HOD" &&(leave.leave.statusHOD ? "text-green-500" : "text-red-500")||
              user.accountType === "Registrar" &&(leave.leave.statusRegistrar ? "text-green-500" : "text-red-500")||
              user.accountType === "Director" &&(leave.leave.statusDirector ? "text-green-500" : "text-red-500"))
            }`}
          >
            <strong>Status:</strong>{" "}
            {
            (user.accountType === "HOD" &&(leave.leave.statusHOD ? "Approved" : "Not Approved")||
            user.accountType === "Registrar" &&(leave.leave.statusRegistrar ? "Approved" : "Not Approved")||
            user.accountType === "Director" &&(leave.leave.statusDirector ? "Approved" : "Not Approved"))
            }
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;