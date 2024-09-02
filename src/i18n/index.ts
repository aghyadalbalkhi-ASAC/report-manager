import { createIntl, createIntlCache } from "react-intl";
import en from "./messages/en.json";
import ar from "./messages/ar.json";

const allMessages = {
  ar,
  en,
};

const cache = createIntlCache();
const locale = localStorage.getItem("locale") || "ar";

const intl = createIntl(
  { messages: allMessages[locale as keyof typeof allMessages], locale },
  cache
);

export default intl;
