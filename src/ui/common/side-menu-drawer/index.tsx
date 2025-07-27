import { Drawer } from "antd";
import { useAtom } from "jotai";
import { sideMenuDrawerAtom } from "./state";
import { SideMenu } from "sekaya-components";
import AppBriefcaseIcon from "src/ui/icons/briefcase-icon";
import { useIntl } from "react-intl";
import { useMatch, useNavigate } from "react-router-dom";
import AppMenuIcon from "src/ui/icons/menu-icon";
import AppLogo from "/images/applogo.png";

const SideMenuDrawer = () => {
  const { locale } = useIntl();
  const isArabic = locale === "ar";
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const isMainPage = useMatch("/index.html");
  const [state, setState] = useAtom(sideMenuDrawerAtom);
  const { open } = state;

  const handleClose = () => {
    setState({ open: false });
  };

  return (
    <Drawer
      open={open}
      width={200}
      title={null}
      closeIcon={null}
      onClose={handleClose}
      classNames={{ body: "bg-white !px-0" }}
    >
      <div className="h-full" dir={isArabic ? "rtl" : "ltr"}>
        <div className="flex justify-between border-b-[1px] px-4 pb-6 pt-4">
          <div className="pe-4" onClick={handleClose}>
            <AppMenuIcon />
          </div>
          <div className="flex-1 max-w-[172.37px]">
            <div className="flex-1 h-[40px] w-[54px]">
              <img src={AppLogo} />
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-73.69px)] px-1 pt-4">
          <SideMenu
            items={[
              {
                key: "exams",
                icon: <AppBriefcaseIcon />,
                content: formatMessage({ id: "exams" }),
                highlighted: !!isMainPage,
                onClick: () => navigate("/"),
              },
            ]}
            footerItems={[]}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default SideMenuDrawer;
