export type FlashSale = {
    id: number;
    createdAt: string;
    updatedAt: string;
    start: string;
    end: string;
    status: "expired" | "active" | "upcoming"; // Enum-like status
    totalProducts: number;
  };