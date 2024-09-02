import { useAtom } from "jotai";
import { FormattedMessage, useIntl } from "react-intl";
import { Input, Typography, Button, message } from "antd";
import { Modal, Form, FormItem } from "sekaya-components";
import { useForm } from "antd/es/form/Form";
import otpFormModalAtom from "./state";
import CountDown from "./count-down";
import AuthModel from "src/models/auth";
import { useMutation } from "@tanstack/react-query";
import { FormProps } from "antd/lib";
import { redirect } from "react-router-dom";
import { storeAccessToken } from "src/helpers";
import { AuthVerify } from "src/types/auth-verify.type";
import { useState } from "react";

const OtpFormModal = () => {
  const [form] = useForm();
  const { locale, formatMessage } = useIntl();
  const [state, setState] = useAtom(otpFormModalAtom);
  const { open, mobile_number } = state;
  const isArabic = locale === "ar";
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  const mutationRequestAccess = useMutation({
    mutationFn: AuthModel.initialize,
  });

  const mutationVerifyOTP = useMutation({
    mutationFn: AuthModel.verify,
    onSuccess(data) {
      setVerifyToken(data);
    },
    onError(error) {
      message.error(error.message);
    },
  });

  const handleFinish: FormProps["onFinish"] = async () => {
    const { otp } = form.getFieldsValue(true);

    if (mobile_number)
      await mutationVerifyOTP.mutateAsync({
        mobile_number,
        otp,
      });
    handleClose();
  };

  const handleRequestAccess = async () => {
    try {
      if (mobile_number)
        await mutationRequestAccess.mutateAsync({
          mobile_number,
        });
    } catch (error) {
      message.error(
        typeof error === "string"
          ? error
          : formatMessage({ id: "login_failed" })
      );
    }
  };

  const setVerifyToken = (data: AuthVerify) => {
    try {
      storeAccessToken(data.access_token);
      window.location.href = `${window.location.origin}/`;
    } catch {
      message.error(formatMessage({ id: "login_failed" }));
      return redirect("/login");
    }
  };

  const handleClose = async () => {
    setState({ open: false, mobile_number: undefined });
    setHasInitialized(false);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      width={453}
      styles={{ body: { padding: "0px" } }}
      title={
        <Typography.Text className="text-lg font-bold">
          <FormattedMessage id="otp_modal" />
        </Typography.Text>
      }
      onCancel={handleClose}
      forceRender
      footer={
        <Button
          type="primary"
          className="w-full min-h-[56px] rounded-xl"
          onClick={form.submit}
        >
          <FormattedMessage id="verify" />
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        style={{ direction: isArabic ? "ltr" : "rtl" }}
        onFinish={handleFinish}
      >
        <div className="otp-login flex flex-row justify-center pt-4">
          <FormItem name="otp">
            <Input.OTP
              autoFocus={false}
              size="large"
              length={4}
              ref={(ref) => {
                if (ref) {
                  const inputs =
                    ref.nativeElement.querySelectorAll<HTMLInputElement>(
                      "input"
                    );
                  inputs.forEach((input) => {
                    input.setAttribute("type", "tel");
                  });

                  if (open && !hasInitialized) {
                    setTimeout(() => {
                      inputs[0].focus();
                      setHasInitialized(true);
                    }, 500);
                  }
                }
              }}
            />
          </FormItem>
        </div>
        <div className="flex flex-row justify-center">
          <CountDown onCompleted={handleRequestAccess} />
        </div>
      </Form>
    </Modal>
  );
};

export default OtpFormModal;
