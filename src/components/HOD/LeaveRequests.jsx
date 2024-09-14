import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveRequests() {
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
        axios.get('/leave-requests')
            .then(res => {
                setLeaveRequests(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const getLeaveRequests = async () => {
        try{
            
        }catch(err){
            console.error(err);
        }
    }

    const groupLeaveRequestsByYearMonth=(leaveRequests)=> {
        const groupedRequests = {};
        leaveRequests.forEach(request => {
            const yearMonth = `${request.fromDate.getFullYear()}-${request.fromDate.getMonth()}`;
            if (!groupedRequests[yearMonth]) {
                groupedRequests[yearMonth] = [];
            }
            groupedRequests[yearMonth].push(request);
        });
        return groupedRequests;
    }
    

    return (
        <div>
            {Object.keys(leaveRequests).map(yearMonth => (
                <div key={yearMonth}>
                    <h2>{yearMonth}</h2>
                    {leaveRequests[yearMonth].map(request => (
                        <div className="card" key={request._id}>
                            <h3>{request.nature}</h3>
                            <p>Period: {request.period}</p>
                            <p>From: {new Date(request.fromDate).toLocaleDateString()}</p>
                            <p>To: {new Date(request.toDate).toLocaleDateString()}</p>
                            <p>Grounds: {request.grounds}</p>
                            {/* Add more fields as needed */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default LeaveRequests;