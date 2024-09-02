import { Layout, message } from "antd";
import AppHeader from "src/ui/common/header";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import mainPageAtom from "./stats";
import { useAtom, useSetAtom } from "jotai";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const { formatMessage } = useIntl();
  const { search } = useLocation();
  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const [state, setState] = useAtom(mainPageAtom);
  const { header } = state;

  return (
    <Layout.Content className="flex flex-col h-full">
      <AppHeader className="h-[88px]" title={header} />
      <div className="bg-[#F8FAFC] lg:h-full p-8"></div>
    </Layout.Content>
  );
};

export default MainPage;
