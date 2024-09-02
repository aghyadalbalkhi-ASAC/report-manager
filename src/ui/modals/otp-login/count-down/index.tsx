import { Button, Space } from "antd";
import React, { useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { FormattedMessage } from "react-intl";

const CountDown = React.memo(({ onCompleted }: { onCompleted: () => void }) => {
  const [k, setK] = useState(0);

  const onCompleteTimeFun = () => {
    setK((i) => ++i);
  };

  const renderer = ({ seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return (
        <Space>
          <span className=" text-sm text-[#64748B]">
            <FormattedMessage id="time_over" />
          </span>
          -
          <Button
            type="text"
            onClick={() => {
              onCompleted();
              onCompleteTimeFun();
            }}
            className=" text-sm text-[#1B7DC7]"
          >
            <FormattedMessage id="resend_otp" />
          </Button>
        </Space>
      );
    } else {
      // Render a countdown
      return <span className="text-sm text-[#51BCA6]">{seconds}</span>;
    }
  };

  return (
    <div>
      <Countdown key={k} date={Date.now() + 59000} renderer={renderer} />
    </div>
  );
});

export default CountDown;
