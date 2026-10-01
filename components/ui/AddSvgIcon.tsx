import * as React from "react";

export const AddSvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    {...props}
  >
    <path
      d="M544.256 480.256h307.2a32.256 32.256 0 0 1 0 64h-307.2v307.2a32.256 32.256 0 0 1-64 0v-307.2h-307.2a32.256 32.256 0 1 1 0-64h307.2v-307.2a32.256 32.256 0 1 1 64 0z"
      fill="#5A5A68"
    ></path>
  </svg>
);

export default AddSvgIcon;
