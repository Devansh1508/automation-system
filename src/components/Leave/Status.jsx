import React from 'react'

const Status = (leave) => {
  return (
    <div>
      <div className={`mb-4 gap-4 flex items-center rounded-lg ${
                    leave.approved ? "bg-green-500" : "bg-[#cd1b1bd7]" 
                  }`}>
                <p
                  className={`text-base transform transition duration-500 hover:scale-105 hover:shadow-2xl color-change p-2 font-bold text-white `}
                >
                  {leave.approved ? "Approved" : "Not Approved"}
                </p>
                <div className="p-1.5 mr-3 bg-white rounded-full">
                <span class="relative right-2left-[50%] flex h-3 w-3">
                  <span class={`animate-ping absolute inline-flex h-full w-full rounded-full ${leave.approved ? "bg-green-500" : "bg-[#cd1b1bd7]"} opacity-75`}></span>
                  <span class={`relative inline-flex rounded-full h-3 w-3 ${leave.approved ? "bg-green-500" : "bg-[#cd1b1bd7]"} `}></span>
                </span>
                </div>
              </div>
    </div>
  )
}

export default Status
