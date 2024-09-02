import React from "react";

const AppLogoutIcon: React.FC<{
  color?: string;
  width?: number;
  height?: number;
}> = ({ color = "#64748B", width = 22, height = 22 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.778 5.556V3.778A1.78 1.78 0 0 0 9 2H2.778A1.78 1.78 0 0 0 1 3.778v10.666a1.78 1.78 0 0 0 1.778 1.778H9a1.78 1.78 0 0 0 1.778-1.778v-1.777M4.555 9.111h12.444m0 0-2.666-2.667m2.666 2.667-2.666 2.667"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AppLogoutIcon;
