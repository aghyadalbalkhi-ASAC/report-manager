import React from "react";

const AppNotificationsIcon: React.FC<{ hasNotifications?: boolean }> = ({
  hasNotifications,
}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 13C22 12.4696 21.7893 11.9609 21.4142 11.5858C21.0391 11.2107 20.5304 11 20 11C19.4696 11 18.9609 11.2107 18.5858 11.5858C18.2107 11.9609 18 12.4696 18 13C16.8516 13.543 15.8726 14.3883 15.1679 15.4453C14.4633 16.5023 14.0596 17.7311 14 19V22C13.9247 22.6217 13.7046 23.2171 13.3572 23.7381C13.0098 24.2592 12.5449 24.6914 12 25H28C27.4551 24.6914 26.9902 24.2592 26.6428 23.7381C26.2954 23.2171 26.0753 22.6217 26 22V19C25.9404 17.7311 25.5367 16.5023 24.8321 15.4453C24.1274 14.3883 23.1484 13.543 22 13"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 25V26C23 26.7956 22.6839 27.5587 22.1213 28.1213C21.5587 28.6839 20.7956 29 20 29C19.2044 29 18.4413 28.6839 17.8787 28.1213C17.3161 27.5587 17 26.7956 17 26V25"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hasNotifications && (
        <circle
          cx="4"
          cy="4"
          r="3.5"
          transform="matrix(-1 0 0 1 18 10)"
          fill="#ED4F9D"
          stroke="white"
        />
      )}
    </svg>
  );
};

export default AppNotificationsIcon;
