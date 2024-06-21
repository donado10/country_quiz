import React from "react";

const Background = () => {
  console.log("hey");
  return (
    <div className="absolute w-full h-[100vh] -z-10">
      <img className="w-full h-[100vh]" src="./src/assets/bg.jpg" alt="" />
    </div>
  );
};

export default Background;
