const AppCloseSquareIcon: React.FC<{ color?: string; bg?: string }> = ({
  color = "#ED4F9D",
  bg = "#FEF3F8",
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
        d="M20.877 15.1224L25.122 10.8774"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25.122 15.1224L20.877 10.8774"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.75 20.5H25.25C29 20.5 30.5 19 30.5 15.25V10.75C30.5 7 29 5.5 25.25 5.5H20.75C17 5.5 15.5 7 15.5 10.75V15.25C15.5 19 17 20.5 20.75 20.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default AppCloseSquareIcon;
