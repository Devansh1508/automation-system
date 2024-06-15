import React from "react";
import { Link } from "react-router-dom";

const Button = (props) => {
  return (
    <Link to={props.link}>
      <div>
        <div
          style={{ backgroundColor: props.color, color: props.textColor }}
          className={`text-center transition-all duration-200 hover:scale-95 px-6 py-2 shadow-xl rounded-md onhover:scale-95 font-bold m-3`}
        >
          {props.text}
        </div>
      </div>
    </Link>
  );
};

export default Button;
