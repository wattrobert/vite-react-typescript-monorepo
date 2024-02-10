import {
  Filters,
  ListPage,
  Order,
  OrderCloudError,
  OrderDirection,
  Orders,
  RequiredDeep,
  SearchType,
  Searchable,
  Sortable,
} from "ordercloud-javascript-sdk";
import { useAuthQuery } from "../query";
import { UseQueryResult } from "@tanstack/react-query";

export interface OrderListOptions {
  buyerID?: string;
  supplierID?: string;
  from?: string;
  to?: string;
  search?: string;
  searchOn?: Searchable<"Orders.List">;
  searchType?: SearchType;
  sortBy?: Sortable<"Orders.List">;
  page?: number;
  pageSize?: number;
  filters?: Filters;
}

function useOrders(
  direction: OrderDirection,
  listOptions?: OrderListOptions
): UseQueryResult<RequiredDeep<ListPage<Order>>, OrderCloudError> {
  return useAuthQuery({
    queryKey: ["orders", direction, listOptions],
    queryFn: async () => {
      return await Orders.List(direction, listOptions);
    },
  });
}

export default useOrders;
