type ExtraInfo = {
 availabe : [
  {
    name: string;
    value: boolean;
  }
 ]
  notAvailabe : [
    {
      name: string;
      value: boolean;
    }
  ]
}

export type Plan = {
  id: number;
  createdAt: string; 
  updatedAt: string;
  isActive: boolean; 
  name: string;
  subtitle: string;
  description: string;
  duration: string;
  price: number;
  extraInfo: ExtraInfo[];
};


