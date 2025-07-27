import axios from "axios";
import { SEKAYA_API_BASE_URL } from "../../constants";
import { message } from "antd";

const sekayaApi = axios.create({
  baseURL: SEKAYA_API_BASE_URL,
});

sekayaApi.defaults.headers.common["Content-Type"] = "application/json";
sekayaApi.defaults.headers.common["Accept-Language"] =
  localStorage.getItem("local") || "ar";

sekayaApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 422) {
      // TODO replace the message here with real error message from backend
      const errorMessage = error["response"]["data"]["detail"];
      message.error(
        errorMessage === "string" ? new Error(errorMessage) : error
      );
    }
    if (error.response?.status === 400) {
      // TODO replace the message here with real error message from backend
      const errorMessage = error["response"]["data"]["detail"];
      message.error(
        errorMessage === "string" ? new Error(errorMessage) : error
      );
    }

    const errorMessage = error["response"]["data"]["detail"];
    return Promise.reject(
      typeof errorMessage === "string" ? new Error(errorMessage) : error
    );
  }
);

export default sekayaApi;
