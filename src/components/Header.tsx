import { Typography } from "antd";
import React from "react";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const { Title } = Typography;
  return (
    <div className="flex items-center gap-2  ">
      <div className="w-[8px] h-[full] rounded-md text-headers bg-headers">
        s
      </div>
      <Title level={3} className="capitalize  !mb-0">
        {title}
      </Title>
    </div>
  );
}
