export type Address = {
  id: number;
  country: string;
  city: string;
  province: string;
  district: string;
  address: string;
  postalCode: string;
  phone: string;
  name: string;
  type: "Home" | "Office" | "Other";
};
