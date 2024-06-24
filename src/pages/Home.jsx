import React from "react";
import Typewriter from "typewriter-effect";
import homePage from "../assets/images/homePage.svg";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); 
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center overflow-hidden ">
      <div className="w-11/12 h-11/12 flex flex-row">
        <div className="mt-[30vh] ml-[10vw] w-[40%] h-[100%]">
          <p className="text-4xl">
            Welcome to the the <br /> Automation system of <br />
            IIIT Pune
          </p>

          <div className="mt-[3vh] h-[12vh]">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "At AutomatePro, we are dedicated to revolutionizing the way/\n businesses operate. Our state-of-the-art\n automation solutions are designed to\n streamline processes, boost efficiency, and reduce costs."
                  )
                  .pauseFor(2500)
                  .deleteAll()
                  .start();
              }}
              options={{
                autoStart: true,
                loop: true,
              }}
            />
          </div>
          <div className="flex flex-row gap-5">
            <Button link="/Login" text="Login" textColor="white" color="#0391DD" />
            <Button link="/Signup" text="Signup" textColor="white" color="#0391DD"/>
          </div>
        </div>
        <div className="w-[50%] h-[100%] mt-[5vh]">
          <img src={homePage} alt="Home" />
        </div>
      </div>
    </div>
  );
};

export default Home;
