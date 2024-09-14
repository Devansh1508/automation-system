import React from 'react'
import { useSelector } from 'react-redux'
const HoverCard = ({leave}) => {
    const { user } = useSelector((state) => state.profile);
    const [hover, setHover] = useState(false);

    const handleHover = ({leave}) => {
        setHover(!hover);
    }
  return (
    <div className='flex items-center justify-center rounded m-4 w-[30vw] shadow-lg p-4 bg-[#f1f0f0] transform transition duration-500 hover:scale-105 hover:shadow-2xl'>
      {
        
      }
    </div>
  )
}

export default HoverCard
