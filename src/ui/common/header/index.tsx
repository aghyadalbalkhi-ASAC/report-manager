import { Avatar, Col, Grid, Layout, Row, Typography } from "antd";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import React from "react";
import classNames from "classnames";
import { Dropdown } from "sekaya-components";
import { useIntl } from "react-intl";
import { changeLanguage } from "src/helpers";
import { useNavigate } from "react-router-dom";
import AppAvatarIcon from "src/ui/icons/avatar-icon";
import AppMenuIcon from "src/ui/icons/menu-icon";
import AppBellIcon from "src/ui/icons/bell-icon";
import { sideMenuDrawerAtom } from "../side-menu-drawer/state";
import { useSetAtom } from "jotai";
import AppLogo from "/images/applogo.png";

interface AppHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className, title }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { lg } = Grid.useBreakpoint();

  const handleChangeLang = (locale: "ar" | "en") => {
    changeLanguage(locale);
    navigate(0);
  };

  return lg ? (
    <Layout.Header
      className={classNames(
        className,
        "h-auto lg:h-32 w-full flex flex-wrap justify-between bg-white py-4 px-8"
      )}
    >
      <Row className="flex items-center lg:gap-y-1 gap-x-6">
        <Col></Col>
        <Col>
          <Typography.Text className="text-2xl font-bold text-midnightBlue ps-2">
            {title}
          </Typography.Text>
        </Col>
      </Row>
      <div className=" sm:w-auto gap-x-6 items-center pt-2">
        <Dropdown
          trigger={["click"]}
          menu={{
            direction: "rtl",
            items: [
              {
                key: "locale",
                icon: <GlobalOutlined />,
                label: formatMessage({ id: "language" }),
                children: [
                  {
                    key: "arabic",
                    label: formatMessage({ id: "arabic" }),
                    onClick: () => handleChangeLang("ar"),
                  },
                  {
                    key: "english",
                    label: formatMessage({ id: "english" }),
                    onClick: () => handleChangeLang("en"),
                  },
                ],
              },
            ],
          }}
        >
          <a className="flex gap-x-3">
            <Avatar size={40} icon={<AppAvatarIcon />} />
            <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </Layout.Header>
  ) : (
    <AppHeaderMobile />
  );
};

const AppHeaderMobile = () => {
  const setSideMenuDrawer = useSetAtom(sideMenuDrawerAtom);

  const openSideMenuDrawer = () => {
    setSideMenuDrawer({ open: true });
  };

  return (
    <Layout.Header className="p-0 h-[74.88px]">
      <div className="flex justify-between bg-white h-full w-full px-4 items-center">
        <div onClick={openSideMenuDrawer}>
          <AppMenuIcon />
        </div>
        <div className="h-[40px] w-[54px]">
          <img src={AppLogo} />
        </div>
        <AppBellIcon />
      </div>
    </Layout.Header>
  );
};

export default AppHeader;
