import React from 'react'
import { Link } from 'react-router-dom'

const Button = (props) => {
  return (
    <Link to={props.link}>
    <div className={`bg-[${props.color}] text-white flex items-center justify-center p-2 rounded-md hover:scale-90 transition-all duration-300`}>
        {props.text}
    </div>
    </Link>
  )
}

export default Button
