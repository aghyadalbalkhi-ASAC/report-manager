import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Space, Typography, message, Grid } from "antd";
import { Form, FormItem, Input } from "sekaya-components";
import AppPhoneIcon from "src/ui/icons/phone-icon";
import runes from "runes2";
import { mobileRegex } from "src/helpers";
import { OtpFormModal } from "src/ui/modals";
import { useForm } from "antd/es/form/Form";
import AuthModel from "src/models/auth";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import otpFormModalAtom from "src/ui/modals/otp-login/state";
import logo from "/images/logo.png";
import Marnlogo from "/images/powered-by-marn.png";
import classNames from "classnames";

const { useBreakpoint } = Grid;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [form] = useForm();
  const setOtpFormModal = useSetAtom(otpFormModalAtom);
  const accessToken = sessionStorage.getItem("token");
  const [mobileInvalid, setMobileInvalid] = useState(true);
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const mobileValidtor = async (value: string) => {
    const pass = !mobileRegex.test(value);
    setMobileInvalid(pass);
    return pass
      ? Promise.reject(
          new Error(
            formatMessage({
              id: "invalid_mobile_number",
            })
          )
        )
      : Promise.resolve();
  };

  const mutationRequestAccess = useMutation({
    mutationFn: AuthModel.initialize,
  });

  const handleRequestAccess = async () => {
    const { mobile_number } = form.getFieldsValue(true);
    try {
      form.validateFields().then(async () => {
        if (!mobile_number) {
          message.info(
            formatMessage({ id: "field_is_required" }, { name: "mobile" })
          );
          return;
        }
        await mutationRequestAccess.mutateAsync({
          mobile_number: `966${mobile_number.slice(1)}`,
        });
        setOtpFormModal({
          open: true,
          mobile_number: `966${mobile_number.slice(1)}`,
        });
      });
    } catch (error) {
      message.error(
        typeof error === "string"
          ? error
          : formatMessage({ id: "login_failed" })
      );
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <div
      className={classNames("flex h-full", {
        "flex-col": isMobile,
        "flex-row": !isMobile,
      })}
    >
      {isMobile ? (
        <div className="flex-auto flex flex-col items-center justify-end h-3/4">
          <img className="block" src={logo} width={240} height={240} />
        </div>
      ) : (
        <div className="bg-[url(/images/sekaya.png)] flex-auto bg-no-repeat bg-bottom bg-cover hidden lg:!block" />
        // <div className="flex-auto bg-no-repeat bg-bottom bg-cover hidden lg:!block" />
      )}
      <div className="flex-auto flex flex-col bg-white h-full justify-center lg:px-0 px-8">
        <div className="w-full max-w-[404px] mx-auto">
          <div className="flex flex-col gap-y-8">
            <Space direction="vertical" size={12}>
              <Typography.Text className="text-sm lg:!text-2xl font-bold text-midnightBlue">
                <FormattedMessage id="login" />
              </Typography.Text>
              <Typography.Text className="text-xs lg:!text-base text-slateGray">
                <FormattedMessage id="sub_text_login" />
              </Typography.Text>
            </Space>
            <Form form={form} className="!gap-y-4">
              <FormItem
                name="mobile_number"
                rules={[
                  {
                    validator: (_, value) => mobileValidtor(value),
                  },
                ]}
              >
                <Input
                  dir="ltr"
                  type="tel"
                  className="w-full min-h-[50px]"
                  size="large"
                  placeholder="0500000000"
                  suffix={<AppPhoneIcon />}
                  count={{
                    max: 10,
                    strategy: (txt) => runes(txt).length,
                    exceedFormatter: (txt, { max }) =>
                      runes(txt).slice(0, max).join(""),
                  }}
                />
              </FormItem>
              <Button
                type="primary"
                disabled={mobileInvalid}
                className="h-14 shadow-none rounded-xl"
                onClick={handleRequestAccess}
              >
                <FormattedMessage id="login" />
              </Button>
            </Form>
          </div>
        </div>
        {isMobile ? (
          <div className="flex-auto flex flex-col items-center justify-center">
            <img className="block" src={Marnlogo} width={175} height={175} />
          </div>
        ) : null}
      </div>
      <OtpFormModal />
    </div>
  );
};

export default LoginPage;
