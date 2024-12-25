import { Link } from "react-router-dom";
import { Category } from "../../types/Categories";

export const productsSaleTable = [
  {
    title: "Product Name",
    render: (record: { name: string; images: string[] }) => (
      <div className="flex gap-2">
        <img
          src={record.images[0]}
          alt="product"
          className="w-[82px] h-[82px] object-cover rounded-lg mr-2"
        />
        <p>{record.name}</p>
      </div>
    ),
    key: "productName",
  },
  {
    title: "Category",
    render: (record: { category: Category }) => <p>{record.category.name}</p>,
    key: "category",
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "discount",
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Action",
    render: (record: { id: number }) => (
      <Link
        to={`/product/${record.id}`}
        className="
        text-primary
        "
      >
        Details
      </Link>
    ),
    key: "action",
  },
];
