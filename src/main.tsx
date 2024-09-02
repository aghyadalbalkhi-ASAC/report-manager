import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { appTheme } from "./theme.ts";
import { RawIntlProvider } from "react-intl";
import intl from "./i18n/index.ts";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router.tsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 0, staleTime: 60000 * 5 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={appTheme}
        locale={intl.locale === "ar" ? arEG : enUS}
      >
        <RawIntlProvider value={intl}>
          <div className="h-full" dir={intl.locale === "ar" ? "rtl" : "ltr"}>
            <AppRouter />
          </div>
        </RawIntlProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
