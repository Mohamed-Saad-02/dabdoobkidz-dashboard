
export const flashsaleTable = [
  {
    title: "Id",
    render: (record: { id: number }) => {
      return <span className="text-gray">{record.id}</span>;
    },
  },
  {
    title: "category",
    render: (record: { product: { category: { name: string } } }) => {
      console.log(record, "record in flashsaledetail");

      return <span className="text-gray">{record.product.category?.name}</span>;
    },
  },
  {
    title: "Quota",
    render: (record: { stock: number }) => {
      return <span className="text-gray">{record?.stock}</span>;
    },
  },
  {
    title: "price",
    render: (record: { product: { price: string } }) => {
      return <span className="text-gray">{record?.product?.price}</span>;
    },
  },
  {
    title : "Ignore Plan",
    render : (record : { ignorePlan : boolean }) => {
      return <span>{record.ignorePlan ? "Yes" : "No"}</span>
    }
  },
  {
    title: "Discount",
    render: (record: { discountAmount: number }) => {
      return <span>{record?.discountAmount}</span>;
    },
  },
  {
    title: "Discount Price",
    render: (record: { discountAmount: number; product :{ price: number} }) => {
        
        
      return <span>{+record?.product?.price - +record?.discountAmount}</span>;
    },
  },
];
