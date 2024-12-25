import { Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from ".";
import { checkAuth } from "../helpers/checkAuth";
import openNotification from "./ui/Notfication";
export default function Layout() {
  const { pathname } = useLocation();
  const isAuthenticated = checkAuth();

  const navigate = useNavigate();
  useEffect(() => {
    console.log(isAuthenticated, "isAuthenticated");

    if (!isAuthenticated) {
      openNotification({
        type: "error",
        message: "Unauthenticated",
        description: "Please login to access this page",
      });
      navigate("/signin");
    }
  }, [isAuthenticated]);
  const { Title } = Typography;
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Topbar />
        <Title level={2} className="capitalize px-4 pt-2 !mb-0">
          {pathname.split("/")[1]}
        </Title>
        <div className="p-4    rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
