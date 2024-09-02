export type AuthInit = {
  success?: boolean;
  random?: string;
  token?: string;
  redirect_otp?: boolean;
  mobile?: string;
};

export type AuthStatus = {
  national_id: number | string;
  encrypted_token?: string;
  random?: string;
};

export type initOtpResponse = {
  national_id: string;
  mobile_number: string;
};
