import type { MenuProps } from "antd";
import { Menu } from "antd";
import { items as allItems } from "../../constants/navLinks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  const roleFromLocalStorage = localStorage.getItem("role");
  useEffect(() => {
    const role = JSON.parse(roleFromLocalStorage || "null");
    console.log(role, "role");

    setUserRole(role);
  }, [roleFromLocalStorage]);

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  const hasAccess = (allowedRoles: string[]) => {
    console.log(allowedRoles, "allowedRoles");

    return allowedRoles.some((role) => userRole === role);
  };

  // const navigate = useNavigate();

  const filteredItems = allItems.filter((item) => hasAccess(item.allowedRoles));
  console.log(filteredItems, "filteredItems");

  return (
    <div className="sideBarContainer">
      <div
        onClick={() => navigate("/")}
        className="w-[163px] mx-auto mt-[12px] cursor-pointer text-4xl font-bold"
      >
        Logo
      </div>
      <Menu
        onClick={onClick}
        style={{ width: 240 }}
        className="custom-menu"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={filteredItems}
      />
    </div>
  );
}
