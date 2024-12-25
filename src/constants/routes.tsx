import Layout from "../components/Layout";
import AddCategory from "../pages/products/categories/AddCategory";
import {
  Coupons,
  Signin,
  Dashboard,
  FlashSale,
  Users,
  Transactions,
  Refund,
  Categories,
  Products,
  Premium,
  Banner,
  UserRole,
  UserDetail,
} from "../pages/index";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Settings from "../pages/Settings";
import TransactionDetails from "../pages/transactions/transactions/TransactionDetails";
import Brands from "../pages/Brands/Brands";
import Plans from "../pages/plans/plans-list/Plans";
import EditCategory from "../pages/products/categories/EditCategory";
import AddBrands from "../pages/Brands/AddBrands";
import EditBrands from "../pages/Brands/EditBrands";
import AddPlan from "../pages/plans/plans-list/AddPlan";
import EditPlan from "../pages/plans/plans-list/EditPlan";
import AddCoupon from "../pages/coupons/AddCoupon";
import EditCoupon from "../pages/coupons/EditCoupon";
import AddProduct from "../pages/products/Product/AddProduct";
import EditProduct from "../pages/products/Product/EditProduct";
import OptionForm from "../components/options/OptionForm";
import AddSubCategory from "../pages/products/categories/AddSubCategory";
import EditSubCategory from "../pages/products/categories/EditSubCategory";
import AddUser from "../pages/userrole/AddUser";
import FlashSaleProducts from "../pages/flashsale/FlashSaleProducts";
import AddOption from "../pages/products/Product/options/AddOption";
import EditOption from "../pages/products/Product/options/EditOption";
import Subscriptions from "../pages/plans/subscriptions/subscriptions";
import Ship from "../pages/transactions/Ship";
import { RoleBasedRoute } from "../components/common/RoleBased";
import RefundDetails from "../pages/transactions/transactions/RefundDetail";
import Testmonials from "../pages/testmonials/Testmonials";
import FlashSaleDetails from "../pages/flashsale/FlashSaleDetails";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Dashboard} />}
            allowedRoles={["super-admin", "accountant-admin"]}
          />
        ),
      },
      {
        path: "/settings",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Settings} />}
            allowedRoles={[
              "super-admin",
              "manager-admin",
              "accountant-admin",
              "admin",
            ]}
          />
        ),
      },
      {
        path: "/coupons",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Coupons} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/add-coupons",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddCoupon} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/coupon/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditCoupon} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/sales",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={FlashSale} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/sales/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={FlashSaleDetails} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/users",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Users} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "manager-admin",
              "accountant-admin",
            ]}
          />
        ),
      },
      {
        path: "/user/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={UserDetail} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "/transactions",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Transactions} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "/transactions/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={TransactionDetails} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "/refunds",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Refund} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "refund/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={RefundDetails} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "/categories",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Categories} />}
            allowedRoles={["super-admin", "manager-admin", "admin"]}
          />
        ),
      },
      {
        path: "/category/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditCategory} />}
            allowedRoles={["super-admin", "manager-admin", "admin"]}
          />
        ),
      },
      {
        path: "/subcategory/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditSubCategory} />}
            allowedRoles={["super-admin", "manager-admin", "admin"]}
          />
        ),
      },
      {
        path: "/add-Category",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddCategory} />}
            allowedRoles={["super-admin", "manager-admin", "admin"]}
          />
        ),
      },
      {
        path: "/add-Subcategory",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddSubCategory} />}
            allowedRoles={["super-admin", "manager-admin", "admin"]}
          />
        ),
      },
      {
        path: "/products",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Products} />}
            allowedRoles={["super-admin", "admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/flash-product",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={FlashSaleProducts} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/add-product",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddProduct} />}
            allowedRoles={["super-admin", "admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/product/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditProduct} />}
            allowedRoles={["super-admin", "admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/premium",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Premium} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "accountant-admin",
              "manager-admin",
            ]}
          />
        ),
      },
      {
        path: "/banners",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Banner} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/roles",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={UserRole} />}
            allowedRoles={["super-admin"]}
          />
        ),
      },
      {
        path: "/brands",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Brands} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/add-brand",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddBrands} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/brand/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditBrands} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/plans",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Plans} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/add-plan",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddPlan} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/plan/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditPlan} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Subscriptions} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "add-option/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddOption} />}
            allowedRoles={["super-admin", "admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/ship/:id",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Ship} />}
            allowedRoles={[
              "super-admin",
              "admin",
              "manager-admin",
              "accountant-admin",
            ]}
          />
        ),
      },
      {
        path: "edit-option/:id/:optionId",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={EditOption} />}
            allowedRoles={["super-admin", "admin", "manager-admin"]}
          />
        ),
      },
      {
        path: "/testmonials",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={Testmonials} />}
            allowedRoles={["super-admin", "manager-admin"]}
          />
        ),
      },

      {
        path: "add-user",
        element: (
          <RoleBasedRoute
            element={<ProtectedRoute element={AddUser} />}
            allowedRoles={["super-admin"]}
          />
        ),
      },
      { path: "*", element: "404 Not Found" },
    ],
  },
  {
    path: "/signin",
    element: <Signin />,
  },
];
