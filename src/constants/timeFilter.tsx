import {  MenuProps } from "antd";
export const items: MenuProps["items"] = [
  {
    label: <span className="text-[16px] font-[500]">Today</span>,
    key: "1",
  },

  {
    label: <span className="text-[16px] font-[500]">Yesterday</span>,
    key: "",
  },

  {
    label: <span className="text-[16px] font-[500]">Last 7 days</span>,
    key: "6",
  },
];
