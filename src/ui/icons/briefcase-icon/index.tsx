const AppBriefcaseIcon: React.FC<{ color?: string }> = ({
  color = "#64748B",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 6.25H19C20.5188 6.25 21.75 7.48122 21.75 9V18C21.75 19.5188 20.5188 20.75 19 20.75H5C3.48122 20.75 2.25 19.5188 2.25 18V9C2.25 7.48122 3.48122 6.25 5 6.25Z"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V12.01"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 13C18.2084 14.4067 15.126 15.1394 12 15.1394C8.87403 15.1394 5.79158 14.4067 3 13"
        fill={color}
      />
      <path
        d="M21 13C18.2084 14.4067 15.126 15.1394 12 15.1394C8.87403 15.1394 5.79158 14.4067 3 13"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AppBriefcaseIcon;
