const AppTickSquareIcon: React.FC<{ color?: string; bg?: string }> = ({
  color = "#24D164",
  bg = "#F0FDF4",
}) => {
  return (
    <svg
      width="46"
      height="26"
      viewBox="0 0 46 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="46" height="26" rx="13" fill={bg} />
      <path
        d="M20.75 20.5H25.25C29 20.5 30.5 19 30.5 15.25V10.75C30.5 7 29 5.5 25.25 5.5H20.75C17 5.5 15.5 7 15.5 10.75V15.25C15.5 19 17 20.5 20.75 20.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.8125 12.9999L21.935 15.1224L26.1875 10.8774"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default AppTickSquareIcon;
