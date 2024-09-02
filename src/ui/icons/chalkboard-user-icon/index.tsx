const ChalkboardUserIcon: React.FC<{ color?: string }> = ({
  color = "#64748B",
}) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)">
        <path
          d="M6.625 5.25A2.25 2.25 0 0 1 8.875 3H21.25a2.25 2.25 0 0 1 2.25 2.25v10.125a2.25 2.25 0 0 1-2.25 2.25h-8.41a5.8 5.8 0 0 0-1.842-2.25H14.5V14.25c0-.622.503-1.125 1.125-1.125h2.25c.622 0 1.125.503 1.125 1.125v1.125h2.25V5.25H8.875v1.726a4.5 4.5 0 0 0-2.25-.601zm0 2.25a3.375 3.375 0 1 1 0 6.75 3.375 3.375 0 0 1 0-6.75m-.939 7.875H7.56a4.69 4.69 0 0 1 4.69 4.686.94.94 0 0 1-.939.939H1.94a.936.936 0 0 1-.94-.939 4.687 4.687 0 0 1 4.686-4.686"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M1 3h22.5v18H1z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ChalkboardUserIcon;
