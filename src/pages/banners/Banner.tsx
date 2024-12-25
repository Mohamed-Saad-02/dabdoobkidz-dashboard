import { FileAddOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getBanners } from "../../api/Banner";
import AddBannerModal from "../../components/banner/AddBannerModal";
import Header from "../../components/Header";
import ReusableTable from "../../components/ui/Table";
import { BannersTable } from "../../constants/tables/Banners";

import EditBannerModal from "../../components/banner/EditBannerModal";
import Loading from "../../components/Loading";

export default function Banner() {
  const [currentPage, setCurrentPage] = useState();
  const [paginationConfig, setPaginationConfig] = useState({
    current: currentPage,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => setCurrentPage(page),
  });

  const params = {
    page: currentPage,
    items: 10,
    order: "desc",
  };
  const filterParams = Object.keys(params).reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});

  const { data: banners, isLoading: bannersLoading } = useQuery(
    ["banners", filterParams],
    () => getBanners(filterParams),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setPaginationConfig({
          ...paginationConfig,
          total: data?.metadata?.count,
          current: currentPage,
        });
      },
    }
  );
  const [openBanner, setOpenBanner] = useState(false);
  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [brandId, setBrandId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("brandId")) {
      setEditBannerOpen(true);
      setBrandId(searchParams.get("brandId"));
    }
  }, [searchParams.get("brandId")]);

  if (bannersLoading) {
    return (
      <div className="h-[70vh] bg-white w-full flex justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-[10px] p-4 ">
      <Header title="Banner" />
      <div className="flex justify-between items-center p-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search Banner"
          className="w-[300px]"
        />
        <Button
          onClick={() => setOpenBanner(true)}
          className="p-4"
          icon={<FileAddOutlined />}
          type="primary"
        >
          Add Banner
        </Button>
      </div>
      <ReusableTable
        columns={BannersTable}
        dataSource={banners?.categories}
        pagination={paginationConfig}
      />
      <AddBannerModal isModalOpen={openBanner} setIsModalOpen={setOpenBanner} />
      <EditBannerModal
        isModalOpen={editBannerOpen}
        setIsModalOpen={setEditBannerOpen}
        bannerId={brandId}
      />
    </div>
  );
}
