import type { MenuProps } from "antd";
import {
  Dashboard,
  Customers,
  Products,
  Transaction,
  Banner,
  Coupons,
  Role,
  Sale,
  Shop,
  Plan,
} from "../assets/icons";
import Testmonials from "../assets/icons/testmonials.svg";

type MenuItem = Required<MenuProps>["items"][number];

const userRoles = ["super-admin", "admin", "manager-admin", "accountant-admin"]; // Example user roles

const hasAccess = (allowedRoles: string[]) => {
  console.log(allowedRoles, "allowedRoles");
  const userRole = JSON.parse(localStorage.getItem("role") || "null");

  
  return allowedRoles.some(
    (role) =>{
      console.log(role, userRole, "role, userRole");
      return userRole === role}
  );
};

export const items: MenuItem[] = [
  {
    key: "/",
    label: "Dashboard",
    icon: <img src={Dashboard} alt="Dashboard" />,
    allowedRoles: ["super-admin", "accountant-admin"],
  },
  {
    key: "Customers",
    label: "Customers",
    icon: <img src={Customers} alt="Customers" />,
    allowedRoles: ["super-admin", "admin", "manager-admin", "accountant-admin"],
    children: [
      {
        key: "users",
        label: "Users",
      },
      {
        key: "premium",
        label: "Premium",
      },
    ],
  },
  {
    key: "products",
    label: "Products",
    icon: <img src={Products} alt="Products" />,
    allowedRoles: ["super-admin", "admin", "manager-admin"],
    children: [
      {
        key: "products",
        label: "List Products",
      },
      {
        key: "categories",
        label: "Categories",
      },
    ],
  },
  {
    key: "Transaction",
    label: "Transaction",
    icon: <img src={Transaction} alt="Transaction" />,
    allowedRoles: ["super-admin", "admin", "accountant-admin", "manager-admin"],
    children: [
      {
        key: "transactions",
        label: "Manage Transactions",
      },
      {
        key: "refunds",
        label: "Manage Refund",
      },
    ],
  },
  {
    key: "plans",
    label: "Plans",
    icon: <img src={Plan} className="h-[24px] w-[24px]" alt="Brand Icon" />,
    allowedRoles: ["super-admin", "manager-admin"],
    children: [
      {
        key: "plans",
        label: "List Plans",
      },
      {
        key: "subscriptions",
        label: "Subscriptions",
      },
    ],
  },
  {
    key: "brands",
    label: "Brands",
    icon: <img src={Shop} className="h-[24px] w-[24px]" alt="Brand Icon" />,
    allowedRoles: ["super-admin", "manager-admin"],
  },
  {
    key: "sales",
    label: "Flash Sale",
    icon: <img src={Sale} alt="Sale" />,
    allowedRoles: ["super-admin", "manager-admin"],
  },
  {
    key: "banners",
    label: "Banner",
    icon: <img src={Banner} alt="Banner" />,
    allowedRoles: ["super-admin", "manager-admin"],
  },
  {
    key: "Testmonials",
    label: "Testmonials",
    icon: <img src={Testmonials} className="h-[24px] w-[24px]" alt="Banner" />,
    allowedRoles: ["super-admin", "manager-admin"],
  },
  {
    key: "coupons",
    label: "Coupons",
    icon: <img src={Coupons} alt="Coupons" />,
    allowedRoles: ["super-admin", "manager-admin"],
  },
  {
    key: "roles",
    label: "User Role",
    icon: <img src={Role} alt="Role" />,
    allowedRoles: ["super-admin"],
  },
].filter(item => hasAccess(item.allowedRoles));