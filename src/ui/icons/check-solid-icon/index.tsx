interface AppcheckSolidIconProps {
  color?: string;
}

const AppcheckSolidIcon: React.FC<AppcheckSolidIconProps> = ({
  color = "#24D164",
}) => {
  return (
    <svg
      width="12"
      height="15"
      viewBox="0 0 12 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1447_8172)">
        <path
          d="M11.7463 3.15442C12.0811 3.49622 12.0811 4.05129 11.7463 4.39309L4.88917 11.3931C4.55435 11.7349 4.0106 11.7349 3.67578 11.3931L0.24721 7.89309C-0.0876116 7.55129 -0.0876116 6.99622 0.24721 6.65442C0.582031 6.31262 1.12578 6.31262 1.4606 6.65442L4.28382 9.53372L10.5356 3.15442C10.8704 2.81262 11.4142 2.81262 11.749 3.15442H11.7463Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1447_8172">
          <rect
            width="12"
            height="14"
            fill="white"
            transform="translate(0 0.272339)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AppcheckSolidIcon;
