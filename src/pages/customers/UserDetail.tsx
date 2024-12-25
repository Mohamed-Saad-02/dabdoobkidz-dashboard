import type { TabsProps } from "antd";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUserId } from "../../api/users";
import Loading from "../../components/Loading";
import UserHeaderDetails from "../../components/user/UserDetailsHeader";

import { Tabs } from "antd";
import { getUserOrdersHistory, getWalletHistory } from "../../api/orders";
import Header from "../../components/Header";
import ReusableTable from "../../components/ui/Table";
import { UserTransactionsTable } from "../../constants/tables/UserTransactions";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading: userloading,
    isError: userError,
  } = useQuery(["userDetail"], () => {
    return getUserId(Number(id));
  });

  const { data: orders, isLoading: ordersLoading } = useQuery(
    "userOrders",
    () => getUserOrdersHistory(Number(id))
  );

  const { data: walletHistory } = useQuery("walletHistory", () =>
    getWalletHistory(Number(id))
  );
  const transactionTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Transaction History",
      children: (
        <div className="flex flex-col gap-[16px]">
          <Header title="User Transactions" />
          <ReusableTable columns={UserTransactionsTable} dataSource={orders} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Wallet History",
      children: (
        <div>
          <Header title="User Wallet" />
          <ReusableTable
            columns={UserTransactionsTable}
            dataSource={walletHistory?.data}
          />
        </div>
      ),
    },
  ];

  if (userloading || ordersLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  if (userError) {
    return (
      <div className="flex justify-center items-center h-full">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <UserHeaderDetails user={user} />
      <div className="p-4 bg-white flex flex-col gap-4">
        <Tabs defaultActiveKey="1" items={transactionTabs} />;
      </div>
    </div>
  );
}
