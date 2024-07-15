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
        console.log("data:");
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
      {console.log(leave.leave.user)}
      <Link to={`/AllLeaves/user/${user._id}/leave/${leave.leave._id}`}>
        <div className="rounded m-4 block w-[30vw] shadow-lg p-4 bg-[#f1f0f0] transform transition duration-500 hover:scale-105 hover:shadow-2xl">
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
          <p className="text-gray-700 text-base">
            <strong>Email: {applicant.email}</strong> 
          </p>
          <p className="text-gray-700 text-base">
            <strong>post: {applicant.accountType}</strong> 
          </p>
          <p
            className={`text-base ${
              leave.leave.approved ? "text-green-500" : "text-red-500"
            }`}
          >
            <strong>Status:</strong>{" "}
            {leave.leave.approved ? "Approved" : "Not Approved"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
