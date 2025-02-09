import React from "react";

export default function WaveDivider() {
  return (
    <div className="relative w-full overflow-hidden leading-none">
      <svg
        className="relative block w-[calc(100%+1.3px)]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        {/* Adjust the fill color to match the next section background */}
        <path
          fill="#151515"
          fillOpacity="1"
          d="M0,128L80,149.3C160,171,320,213,480,218.7C640,224,800,192,960,160C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}
