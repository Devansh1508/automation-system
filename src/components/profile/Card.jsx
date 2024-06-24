import React from 'react'

const Card = (props) => {
  return (
    <div>
      <div className="bg-[#212c54e7] duration-300 flex flex-col items-center justify-between hover:scale-110 transition-all h-[10vh] m-2 rounded-md w-[18vw]">
        <p className="text-[#e9e3e3d7] my-1">{props.title}</p>
        <p className='text-white my-1'>{props.data}</p>
      </div>
    </div>
  )
}

export default Card;
