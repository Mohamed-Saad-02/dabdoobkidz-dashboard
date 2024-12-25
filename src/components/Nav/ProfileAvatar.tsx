import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import openNotification from "../ui/Notfication";
import { useQuery } from "react-query";
import { getMe } from "../../api/auth";
import { Shop } from "../../assets/icons";
export default function ProfileAvatar() {

  const {data} = useQuery("profile",getMe)

  
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      label: (
        <Link to="/Settings">
          <div className="flex gap-3">
            <SettingOutlined />
            <span className="text-[16px] font-[500]">Settings</span>
          </div>
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <div
          onClick={() => {        
            localStorage.removeItem("accessToken");
            openNotification({
              type: "success",
              message: "Logout Successfull",
              description: "You have been logged out successfully",
            });
            navigate("/signin");
          }}
        >
          <div className="flex gap-3">
            <LogoutOutlined />
            <span className="text-[16px] font-[500] pr-4">Logout</span>
          </div>
        </div>
      ),
      key: "2",
    },
  ];
  return (
    <div className="flex gap-6 items-center">
      {/* <BellOutlined style={{ fontSize: "24px" }} /> */}

      <Dropdown className="w-full " menu={{ items }} trigger={["click"]}>
        <div className="flex gap-2 cursor-pointer items-center">
          <Avatar size={40}  src={
            data?.avatar
          } icon = {
            <UserOutlined style={{ fontSize: "24px" }} />
          } />
      
            <div className="flex gap-6">
              <div>
                <span className="font-[] text-[14px] whitespace-nowrap">
                  {data?.firstName} {data?.lastName}
                </span>
                <br />
                <span>{data?.role}</span>
              </div>
              <DownOutlined />
            </div>
      
        </div>
      </Dropdown>
    </div>
  );
}
