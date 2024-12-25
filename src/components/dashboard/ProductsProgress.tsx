import { Progress } from "antd";

const ProductsProgress = ({ data }: any) => {
  return (
    <div
      className="mx-auto w-full justify-center p-4 mt-10"
      style={{ display: "flex", alignItems: "center", gap: "24px" }}
    >
      <div className="w-full" style={{ position: "relative" }}>
        <Progress
          type="circle"
          percent={75}
          size={200}
          format={() => ""}
          strokeWidth={8}
          strokeColor="#A0522D" // Brown color for the outer circle
          trailColor="#F5F5F5" // Light gray for the trail
          style={{ position: "absolute", top: -100, left: 0 }}
        />
        <Progress
          type="circle"
          percent={75}
          size={150}
          strokeWidth={8}
          format={() => ""}
          strokeColor="#FFD700" // Yellow color for the inner circle
          trailColor="transparent"
          style={{ position: "absolute", top: -75, left: 25 }}
        />
      </div>
      <div className="w-full">
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#A0522D",
              borderRadius: "50%",
              marginRight: 8,
            }}
          ></span>
          <span>Product Sold</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          {data?.paidProducts}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#FFD700",
              borderRadius: "50%",
              marginRight: 8,
            }}
          ></span>
          <span>Product Returned</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: "bold" }}>
          {data?.refundedProducts}
        </div>
      </div>
    </div>
  );
};

export default ProductsProgress;
