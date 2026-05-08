export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type QueryKeys = 
  | ["auth"]
  | ["myPets"]
  | ["feed"]
  | ["post", number]
  | ["comments", number]
  | ["conversations"]
  | ["conversation", number]
  | ["notifications"];