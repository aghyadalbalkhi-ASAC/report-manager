const AppDirectboxSendIcon: React.FC<{ color?: string; bg?: string }> = ({
  color = "#2563EB",
  bg = "#F0F5FF",
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
        d="M23 10V5.5L21.5 7"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M23 5.5L24.5 7"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.25 13C16.25 13 16.25 14.3425 16.25 16V16.75C16.25 18.82 16.25 20.5 20 20.5H26C29 20.5 29.75 18.82 29.75 16.75V16C29.75 14.3425 29.75 13 26.75 13C26 13 25.79 13.1575 25.4 13.45L24.635 14.26C23.75 15.205 22.25 15.205 21.3575 14.26L20.6 13.45C20.21 13.1575 20 13 19.25 13Z"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.75 13V11.5C17.75 9.99253 17.75 8.74753 20 8.53003"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M28.25 13V11.5C28.25 9.99253 28.25 8.74753 26 8.53003"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default AppDirectboxSendIcon;
