import { ThemeConfig } from "antd";

export const appTheme: ThemeConfig = {
  token: {
    fontFamily: "Inter, Noto Sans Arabic, sans-serif",
    borderRadius: 8,
    colorPrimary: "#16637F",
    colorSuccess: "#42C75E",
    colorWarning: "#F6A723",
    colorError: "#ED4F9D",
    colorTextBase: "#0F172A",
    colorBgBase: "#F8FAFC",
    colorSuccessBg: "#F0FDF4",
    colorErrorBg: "#F15568",
    colorWarningBg: "#FFFBEB",
    colorInfoBg: "#EFF6FF",
    fontSize: 16,
    fontSizeSM: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
  },
  components: {
    Button: {
      defaultActiveColor: "#fff",
    },
    Progress: {
      defaultColor: "#16637F",
      remainingColor: "#E2E8F0",
      lineBorderRadius: 50,
    },
    Input: {
      colorBorder: "#E2E8F0",
      colorText: "#94A3B8",
    },
    Select: {
      colorText: "#94A3B8",
    },
    DatePicker: {
      colorText: "#94A3B8",
    },
    Modal: {
      titleColor: "#0F172A",
      headerBg: "#fff",
      contentBg: "#fff",
    },
    Pagination: {
      colorText: "#94A3B8",
      itemSize: 32,
      fontSize: 14,
    },
    Segmented: {
      trackBg: "#F8FAFC",
      itemColor: "#64748B",
      itemSelectedBg: "#fff",
      itemSelectedColor: "#16637F",
      trackPadding: 4,
    },
    Card: {
      actionsBg: "#fff",
    },
    Collapse: {
      headerBg: "#fff",
      contentBg: "#fff",
      contentPadding: "16px 16px 0px",
    },
  },
};
