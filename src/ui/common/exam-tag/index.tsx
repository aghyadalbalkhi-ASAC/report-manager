import { Typography } from "antd";
import { Tag } from "sekaya-components";
import { FormattedMessage } from "react-intl";

const ExamTags = ({ status = "" }: { status: string }) => {
  let bgColor, textColor;
  const contractStatus = status?.toLocaleLowerCase();
  switch (contractStatus) {
    case "paid":
      bgColor = "#e3ecf0";
      textColor = "#16637F1F";
      break;
    case "passed":
      bgColor = "#F0FDF4";
      textColor = "#24D164";
      break;
    case "timeout":
      bgColor = "#FDF2F8";
      textColor = "#EB2578";
      break;
    case "failed":
      bgColor = "#F6F8FB";
      textColor = "#64748B";
      break;
    default:
      bgColor = "#F6F8FB";
      textColor = "#64748B";
      break;
  }

  return (
    <Tag className="!rounded-full" color={bgColor}>
      <Typography.Text className={`text-[10px] text-[${textColor}] w-fit`}>
        <FormattedMessage id={status} />
      </Typography.Text>
    </Tag>
  );
};

export default ExamTags;
