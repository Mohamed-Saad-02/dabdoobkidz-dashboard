import { Tabs, TabsProps } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductInfoForm from "../../../components/products/ProductInfoForm";
import Options from "./options/Options";
import Variants from "./varaint/Variants";

export default function EditProduct() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("tab") || "1"
  );
  const productTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Product info",
      children: <ProductInfoForm type="edit" />,
    },
    {
      key: "2",
      label: "Options",
      children: <Options />,
    },
    {
      key: "3",
      label: "Variants",
      children: <Variants />,
    },
  ];
  return (
    <div>
      <Tabs
        className=""
        activeKey={selectedTab}
        onChange={(key) => {
          setSelectedTab(key);
          setSearchParams({ tab: key });
        }}
        defaultActiveKey="1"
        items={productTabs}
      />
      ;
    </div>
  );
}
