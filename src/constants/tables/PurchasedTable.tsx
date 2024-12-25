import { Typography } from "antd";
import { Product, Variant } from "../../types/Product";

const { Title } = Typography;
export const PurchasedTable = [
  {
    title: "Product",
    render: (record: { product: Product }) => (
      <div className="flex">
        <img
          src={record.product.images[0]}
          alt="product"
          className="w-[82px] object-cover rounded-lg mr-2"
        />
        <Title className="!mb-0" level={5}>
          {record.product.name.en}
        </Title>
      </div>
    ),
    key: "product",
  },
  {
    title: "Size",
    render: (record: { variant: Variant }) => {
      if (!record.variant) return <span>Not Available</span>;
      return <span>{record.variant.size}</span>;
    },
    key: "size",
  },

  {
    title: "Color",
    render: (record: { variant: Variant }) => {
      if (!record.variant) return <span>Not Available</span>;
      return <span>{record.variant.color}</span>;
    },
    key: "size",
  },

  
];
