import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getTransactionDetails } from "../../../api/transaction";
import TransactionDetailData from "../../../components/transactions/TransactionDetailData";

export default function TransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: transactionDetails } = useQuery("transaction", () =>
    getTransactionDetails(Number(id))
  );

  return (
    <div className="flex flex-col ">
      <div className=" flex flex-col gap-4">
        <TransactionDetailData transactionDetails={transactionDetails} />
      </div>
    </div>
  );
}
