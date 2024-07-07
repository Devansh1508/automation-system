import React , {useEffect, useState} from 'react'
import Card from '../components/approvedLeaves/Card'
import Navbar from '../components/common/Navbar'
import { errorMessage } from '../utils/Popup'
import { useSelector } from 'react-redux'

const Registrar = () => {
    const [leave, setLeave] = useState([]);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        getApprovedLeaves();
      }, []);

    const getApprovedLeaves = async () => {
        try {
          console.log("hello");
          const response = await fetch(
            `http://localhost:4000/api/v1/leaves/getApprovedLeaves`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          console.log("data:", data.data);
    
          if (data.success) {
            setLeave(data.data);
          } else {
            errorMessage(data.message);
          }
        } catch (err) {
          console.log("err:", err);
          errorMessage("error while fetching profile");
        }
      };

  return (
    <div>
      <Navbar />
      {
        leave.map((leave) => (
          <Card key={leave._id} leave={leave} />
        ))
      }
    </div>
  )
}

export default Registrar
