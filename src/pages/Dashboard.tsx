import { DatePicker } from "antd";
import Header from "../components/Header";
import BarChartComponent from "../components/dashboard/BarChart";
import ProductsProgress from "../components/dashboard/ProductsProgress";
import SalesCard from "../components/dashboard/analyticsCard";

import { useState } from "react";
import { useQuery } from "react-query";
import UsersIcon from "../../src/assets/icons/dashboard/users.svg";
import { getAnalytics } from "../api/analytics";
import Loading from "../components/Loading";
import InsightsCard from "../components/dashboard/InsightsCard";
import TopProductsTable from "../components/dashboard/TopProductsTable";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);

  const { data, isLoading } = useQuery(
    [
      "analytics",
      {
        startDate: dateRange ? dateRange[0].toISOString() : undefined,
        endDate: dateRange ? dateRange[1].toISOString() : undefined,
      },
    ],
    () => {
      const params = dateRange
        ? {
            startDate: dateRange[0].toISOString(),
            endDate: dateRange[1].toISOString(),
          }
        : undefined;
      return getAnalytics(params);
    }
  );

  const { RangePicker } = DatePicker;
  if (isLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex justify-between">
        <h1 className="font-[600] text-[28px]">Dashboard</h1>
        <RangePicker onChange={(dates) => setDateRange(dates)} />
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-2 w-full">
          <SalesCard title="Sales" values={data?.orders?.completed?.total} />
          <SalesCard title="Users" values={data?.users?.users?.total?.total} />
          <SalesCard title="Active Now" values={data?.users?.users?.active} />
        </div>
        <div className="flex w-full gap-4">
          <div className=" flex flex-col w-[60%] gap-4">
            <div className=" flex flex-col gap-[18px] ">
              <div className="flex gap-[12px]">
                <InsightsCard
                  title={"Subscriptions"}
                  value={data?.subscriptions?.subscribed}
                  imgSrc={UsersIcon}
                />
                <InsightsCard
                  title={"Total Product"}
                  value={data?.products?.totalProducts}
                  imgSrc={UsersIcon}
                />
              </div>
              <div className="flex gap-[12px]">
                <InsightsCard
                  title={"Total Orders"}
                  value={data?.orders?.completed?.total}
                  imgSrc={UsersIcon}
                />
                <InsightsCard
                  title={"Total Refunds"}
                  value={data?.orders?.refunded?.total}
                  imgSrc={UsersIcon}
                />
              </div>
              <div className="flex gap-[12px]">
                <InsightsCard
                  title={"Total Categories"}
                  value={data?.categories?.totalCategories}
                  imgSrc={UsersIcon}
                />
                <InsightsCard
                  title={"Total Subcategories"}
                  value={data?.subcategories?.totalSubcategories}
                  imgSrc={UsersIcon}
                />
                <InsightsCard
                  title={"Total Brands"}
                  value={data?.brands?.totalBrands}
                  imgSrc={UsersIcon}
                />
              </div>
            </div>

            <div className=" bg-white p-4 flex flex-col">
              <BarChartComponent />

              {/* <OutletStats /> */}
            </div>
          </div>

          <div className="flex flex-col w-[40%] gap-4 ">
            <div className="bg-white p-4">
              <Header title="Products Progress" />
              <ProductsProgress data={data?.productSalesAnalytics} />
            </div>
            <div>
              <div className="bg-white p-4">
                <Header title="Top Products" />
                <TopProductsTable data={data?.productPayment} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
