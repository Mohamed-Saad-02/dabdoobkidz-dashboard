import { Product, Variant } from "./Product";

export type Order = {
    id: number;
    createdAt: string;
    updatedAt: string;
    orderReference: string;
    itemsCount: number;
    totalPrice: number;
    discount: number;
    promocode: string | null;
    user: number;
    orderStatus: string;
    paymentMethod: string;
    delivertStatus: string;
    purchaseDate: string;
    paymobOrderId: string | null;
    shippingFees: number;
    orderType: string;
    address: number;
    barcode: string | null;
    items: Item[];
  };

 export type Item = {
    options: any;
    options: any;
    id: number;
    createdAt: string;
    updatedAt: string;
    count: number;
    totalPrice: number;
    discount: number;
    product: Product;
    variant: Variant;
    plan: null; // Assuming this is always null based on the provided data
    order: number;
    shippingStatus: string;
    returned: boolean;
    refunded: boolean;
  };