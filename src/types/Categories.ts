export type Name = {
  en: string;
  ar?: string;
};

export type Category = {
  id? : number
  name: string;
  description: string;
  isActive: boolean;
  images: string[];
};

export type Dragger = {
  name: string;
  response : {
    data: {
      url: string;
    }
  }
  status: string;
  uid: string;
  url: string;
};
