const AppDotIcon: React.FC<{ color?: string }> = ({ color = "#42C75E" }) => {
  return (
    <svg
      width="9"
      height="8"
      viewBox="0 0 9 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4.12109" cy="4" r="4" fill={color} />
    </svg>
  );
};

export default AppDotIcon;
