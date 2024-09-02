const AppTimerIcon: React.FC<{ color?: string; bg?: string }> = ({
  color = "#F6A723",
  bg = "#FFFBEB",
}) => {
  return (
    <svg
      width="44"
      height="26"
      viewBox="0 0 44 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="44" height="26" rx="13" fill={bg} />
      <path
        d="M24.1594 6.33325H19.8394C17.3327 6.33325 17.1394 8.58658 18.4927 9.81325L25.506 16.1866C26.8594 17.4133 26.666 19.6666 24.1594 19.6666H19.8394C17.3327 19.6666 17.1394 17.4133 18.4927 16.1866L25.506 9.81325C26.8594 8.58658 26.666 6.33325 24.1594 6.33325Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default AppTimerIcon;
