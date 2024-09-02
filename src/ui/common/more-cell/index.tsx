import { DropdownProps } from "antd";
import { Dropdown } from "sekaya-components";
import React from "react";
import AppDotsIcon from "src/ui/icons/dots-icon";

interface MoreCellProps {
  menu: DropdownProps["menu"];
  trigger?: DropdownProps["trigger"];
}

const MoreCell: React.FC<MoreCellProps> = ({ menu, trigger }) => {
  return (
    <Dropdown menu={menu} trigger={trigger}>
      <a onClick={(e) => e.preventDefault()}>
        <span className="flex items-center justify-center h-full w-full">
          <AppDotsIcon />
        </span>
      </a>
    </Dropdown>
  );
};

export default MoreCell;
