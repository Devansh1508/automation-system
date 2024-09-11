import React from 'react'

const Status = ({status}) => {
  return (
    <div>
      {console.log("status",status)}
      <div className={`mb-4 gap-4 flex items-center rounded-lg ${
                    status ? "bg-green-500" : "bg-[#cd1b1bd7]" 
                  }`}>
                <p
                  className={`text-base transform transition duration-500 hover:scale-105 hover:shadow-2xl color-change p-2 font-bold text-white `}
                >
                  {status ? "Approved" : "Not Approved"}
                </p>
                <div className="p-1.5 mr-3 bg-white rounded-full">
                <span className="relative right-2left-[50%] flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status ? "bg-green-500" : "bg-[#cd1b1bd7]"} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${status ? "bg-green-500" : "bg-[#cd1b1bd7]"} `}></span>
                </span>
                </div>
              </div>
    </div>
  )
}

export default Status
