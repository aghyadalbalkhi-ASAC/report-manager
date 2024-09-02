import { redirect, Outlet, useMatch } from "react-router-dom";
import { Suspense, useMemo } from "react";
import Modals from "./ui/modals";
import { Grid, Layout, Spin } from "antd";
import { SideMenu } from "sekaya-components";
import { useIntl } from "react-intl";
import AppLogoutIcon from "./ui/icons/logout-icon";
import { useNavigate } from "react-router";
import { removeAccessToken } from "./helpers";
import confirm from "antd/lib/modal/confirm";
import { SideMenuItemProps } from "sekaya-components/dist/components/side-menu/menu-item";
import AppBriefcaseIcon from "./ui/icons/briefcase-icon";
import SideMenuDrawer from "./ui/common/side-menu-drawer";

export const App = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const isMainPage = useMatch("/");
  const { lg } = Grid.useBreakpoint();

  const openLogoutConfirmation = () => {
    confirm({
      icon: null,
      content: formatMessage({ id: "logout_confirmation" }),
      className: "font-sans",
      okButtonProps: {
        className: "bg-dodgerBlue font-sans",
      },
      okText: formatMessage({ id: "logout" }),
      closable: true,
      onOk() {
        removeAccessToken();
        location.href = "/login";
      },
    });
  };

  const sideMenuItems: Array<SideMenuItemProps> = useMemo(
    () => [
      {
        key: "exams",
        icon: <AppBriefcaseIcon />,
        content: formatMessage({ id: "exams" }),
        highlighted: !!isMainPage,
        onClick: () => navigate("/"),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMainPage]
  );

  return (
    <Layout style={{ height: "100%" }}>
      {lg && (
        <Layout.Sider className="!bg-white" width={250}>
          <div className="h-full flex items-center py-8 pb-14 flex-col">
            <div className="flex flex-row">
              <div className="mb-14 bg-[url(/images/ILFEN.png)] bg-no-repeat bg-center bg-cover w-[147px] h-[123px]" />
            </div>
            <SideMenu
              items={sideMenuItems}
              footerItems={[
                {
                  key: "logout",
                  icon: <AppLogoutIcon />,
                  content: formatMessage({ id: "logout" }),
                  onClick: openLogoutConfirmation,
                },
              ]}
            />
          </div>
        </Layout.Sider>
      )}
      <Layout>
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <Spin />
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <Modals />
        <SideMenuDrawer />
      </Layout>
    </Layout>
  );
};

App.loader = async () => {
  const accessToken = sessionStorage.getItem("token");
  if (accessToken) {
    return null;
  }

  return redirect("/login");
};

export default App;
