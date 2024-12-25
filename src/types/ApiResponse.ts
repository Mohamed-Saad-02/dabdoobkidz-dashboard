interface Metadata {
  totalPages: number;
  currentPage: number;
  count: number;
}

export type ApiResponse<T, K extends string = 'items'> = {
  status: string;
  data: T extends any[]
    ? { [key in K]: T } & { metadata: Metadata }
    : T;
};
