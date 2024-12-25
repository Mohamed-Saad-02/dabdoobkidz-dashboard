import { useEffect, useState } from "react";
import ReusableTable from "../ui/Table";
import { discountConfirmationTable } from "../../constants/tables/DiscountConfitmationTable";

export const Confirmation = ({ selectedRows, salesInfo }: any) => {
    const [confirmationData, setConfirmationData] = useState();

    useEffect(() => {
      setConfirmationData(() =>
        selectedRows.map((item) => {
          return {
            id: item?.id,
            name: item?.name,
            category: item?.category?.name,
            stock: salesInfo?.[`stock[${item.id}]`],
            price: item?.price,
            discount: salesInfo?.[`discountAmount[${item.id}]`],
            discountType: salesInfo?.[`discountType[${item.id}]`],
            // ignorePlan: salesInfo?.[`ignorePlan[${item.id}]`],
          };
        })
      );
    }, []);
    return (
      <div className="flex flex-col justify-center items-center gap-[16px]">
        <h1 className="text-[24px] font-[600]">Confirmation</h1>
        <p className="text-textgray">
          Are you sure you want to add this flash sale?
        </p>
        <ReusableTable
          dataSource={confirmationData}
          columns={discountConfirmationTable}
          paginationConfig={false}
        />
      </div>
    );
  };