import { atom } from "jotai";

const otpFormModalAtom = atom<{
  open: boolean;
  mobile_number: string | undefined;
}>({
  open: false,
  mobile_number: undefined,
});

export default otpFormModalAtom;
