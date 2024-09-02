const AppFileIcon: React.FC<{ color?: string }> = ({ color = "#2563EB" }) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.000427246" width="42" height="42" rx="10" fill="#F8FAFC" />
      <path
        d="M22.8338 12.75V16.4167C22.8338 16.6598 22.9303 16.8929 23.1023 17.0648C23.2742 17.2368 23.5073 17.3333 23.7504 17.3333H27.4171"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.5838 29.25H16.4171C15.9309 29.25 15.4646 29.0568 15.1207 28.713C14.7769 28.3692 14.5838 27.9029 14.5838 27.4167V14.5833C14.5838 14.0971 14.7769 13.6308 15.1207 13.287C15.4646 12.9432 15.9309 12.75 16.4171 12.75H22.8338L27.4171 17.3333V27.4167C27.4171 27.9029 27.2239 28.3692 26.8801 28.713C26.5363 29.0568 26.07 29.25 25.5838 29.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2504 18.25H19.1671"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2504 21.9167H23.7504"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2504 25.5833H23.7504"
        stroke="#3B82F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AppFileIcon;
