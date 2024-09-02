import { atom } from "jotai";
import { AuthInit, initOtpResponse } from "src/types/auth-init.type";

const loginAtom = atom<{
  otpResponse?: initOtpResponse;
  national_id?: number;
  mobile?: string;
  nafathUI: boolean;
}>({
  national_id: undefined,
  mobile: undefined,
  nafathUI: true,
});

export const nafathResponseAtom = atom<AuthInit | undefined>(undefined);

export default loginAtom;
