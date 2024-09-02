const AppPlusIcon: React.FC<{ color?: string }> = ({ color = "white" }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.75 1.25C7.75 0.834375 7.41563 0.5 7 0.5C6.58437 0.5 6.25 0.834375 6.25 1.25V6.25H1.25C0.834375 6.25 0.5 6.58437 0.5 7C0.5 7.41563 0.834375 7.75 1.25 7.75H6.25V12.75C6.25 13.1656 6.58437 13.5 7 13.5C7.41563 13.5 7.75 13.1656 7.75 12.75V7.75H12.75C13.1656 7.75 13.5 7.41563 13.5 7C13.5 6.58437 13.1656 6.25 12.75 6.25H7.75V1.25Z"
        fill={color}
      />
    </svg>
  );
};

export default AppPlusIcon;
