import { RuleObject } from "antd/es/form";
import { AppShieldIncompleteIcon } from "./ui/icons/shield-incomplete-icon";
import AppShieldCheckIcon from "./ui/icons/shield-check-icon";
import { AppShieldFailedIcon } from "./ui/icons/shield-failed-icon";
import { AppShieldPendingIcon } from "./ui/icons/shield-pending-icon";

export const pickTruthyKeys = (object: { [key: string]: unknown }) => {
  return JSON.parse(JSON.stringify(object));
};

export const checkboxRequiredValidator = (
  error: string
): RuleObject["validator"] => {
  return (_, value) =>
    value ? Promise.resolve() : Promise.reject(new Error(error));
};

export const paginationSizeOptions = [25, 50, 100];

export const saveAsFile = (arrayBuffer: string, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([arrayBuffer]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
};

export const getShieldIconByStatus = (status: string) => {
  switch (status) {
    case "PASSED":
      return <AppShieldCheckIcon />;
    case "FAILED":
      return <AppShieldFailedIcon />;
    case "SENT_FOR_CHECK":
      return <AppShieldPendingIcon />;
    default:
      return <AppShieldIncompleteIcon />;
  }
};

export const getDeviceInfo = () => {
  let OSName = "Unknown OS";
  const nAgt = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = "" + parseFloat(navigator.appVersion);
  let majorVersion = parseInt(navigator.appVersion, 10);
  let nameOffset, verOffset, ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) !== -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Edge ,
  else if ((verOffset = nAgt.indexOf("Edge")) !== -1) {
    browserName = "Edge";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) !== -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(";")) !== -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) !== -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";
  if (navigator.appVersion.indexOf("Android") !== -1) OSName = "Android";
  if (navigator.appVersion.indexOf("iPhone") !== -1) OSName = "iPhone";

  return {
    browserName,
    fullVersion,
    majorVersion,
    OSName,
  };
};
