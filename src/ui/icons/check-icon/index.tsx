interface AppCheckIconProps {
  color?: string;
  width?: number;
  height?: number;
}

const AppCheckIcon: React.FC<AppCheckIconProps> = ({
  color = "#BDBDBD",
  width = 25,
  height = 24,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.4082" cy="12" r="12" fill={color} />
      <path
        d="M6.76172 12.2505C8.16937 13.531 10.3662 15.5295 10.3662 15.5295L17.35 9.17651"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AppCheckIcon;
