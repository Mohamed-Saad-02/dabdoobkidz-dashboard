import { Tabs, TabsProps } from "antd";
import Header from "../../../components/Header";
import ProductInfoForm from "../../../components/products/ProductInfoForm";
import Options from "./options/Options";

export default function AddProduct() {
  const productTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Product info",
      children: <ProductInfoForm type="add" />,
    },
    {
      key: "2",
      label: "Options",
      disabled: true,
      children: <Options />,
    },
    {
      key: "3",
      label: "Variants",
      disabled: true,
      children: <div></div>,
    },
  ];
  return (
    <div>
      <Header title="Product Information" />
      <Tabs className="" items={productTabs} />
    </div>
  );
}
