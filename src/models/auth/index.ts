import ilfenApi from "src/apis/sekaya";
import { getDeviceInfo } from "src/helpers";
import { AuthInit } from "src/types/auth-init.type";
import { version as appVersion } from "../../../package.json";
import { AuthVerify } from "src/types/auth-verify.type";

class AuthModel {
  public static async initialize({ mobile_number }: { mobile_number: string }) {
    return (
      await ilfenApi.post<AuthInit>(`c/auth/request_login`, { mobile_number })
    ).data;
  }

  public static async verify({
    mobile_number,
    otp,
  }: {
    mobile_number: string;
    otp: string;
  }) {
    const { browserName, majorVersion, fullVersion } = getDeviceInfo();
    const device = {
      uuid: browserName + majorVersion,
      platform: browserName,
      app_version: appVersion,
      platform_version: fullVersion,
    };

    return (
      await ilfenApi.post<AuthVerify>(`c/auth/verify_login`, {
        mobile_number,
        otp,
        device,
      })
    ).data;
  }
}

export default AuthModel;
