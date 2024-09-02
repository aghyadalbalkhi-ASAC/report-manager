import React from "react";

const AppCloseIcon: React.FC<{
  className?: string;
}> = (props) => {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="40"
        height="40"
        rx="8"
        transform="matrix(-1 0 0 1 40.0001 0)"
        fill="#F8FAFC"
      />
      <path
        d="M15.0504 15.0508L24.9498 24.9503"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.9498 15.0508L15.0503 24.9503"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AppCloseIcon;
