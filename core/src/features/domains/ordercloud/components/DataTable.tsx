import { Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ListPage,
  OrderCloudError,
  RequiredDeep,
} from "ordercloud-javascript-sdk";
import { FC, useCallback, useMemo } from "react";

export interface DataTableOptions<TData = unknown, TColumn = unknown> {
  data: RequiredDeep<ListPage<TData>>;
  onPageChange?: (state: PaginationState) => void;
  columns: ColumnDef<RequiredDeep<TData>, TColumn>[];
}

function useDataTable<TData = unknown, TColumn = unknown>(
  options: DataTableOptions<TData, TColumn>
) {
  const { data, columns, onPageChange } = options;

  const pagination = useMemo(
    () => ({
      pageIndex: data?.Meta?.Page || 0,
      pageCount: data?.Meta?.TotalPages,
      pageSize: data?.Meta?.PageSize || 20,
    }),
    [data]
  );

  const handlePaginationChange: OnChangeFn<PaginationState> =
    useCallback(() => {
      if (!onPageChange) return;
      return onPageChange;
    }, [onPageChange]);

  const table = useReactTable<RequiredDeep<TData>>({
    data: data?.Items || [],
    columns,
    pageCount: data?.Meta?.TotalPages,
    state: {
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
  });

  return table;
}

const DataTable: FC<{
  query: UseQueryResult<RequiredDeep<ListPage<unknown>>, OrderCloudError>;
}> = ({ query }) => {
  const defaultData = useMemo<RequiredDeep<ListPage<unknown>>>(
    () => ({
      Items: [],
      Meta: {
        TotalPages: 0,
        TotalCount: 0,
        Page: 1,
        PageSize: 20,
        ItemRange: [0, 21],
        NextPageKey: "",
      },
    }),
    []
  );

  const data = useMemo(() => {
    return query?.data || defaultData;
  }, [query, defaultData]);

  const columnHelper = createColumnHelper<RequiredDeep<unknown>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useDataTable({
    data,
    columns: [
      columnHelper.accessor("ID", {
        enableResizing: true,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("Status", {
        enableResizing: true,
        cell: (info) => info.getValue(),
      }),
      columnHelper.group({
        header: "From User",
        columns: [
          columnHelper.accessor("FromUser.Email", {
            header: "Email",
          }),
          columnHelper.accessor("FromUser.FirstName", {
            header: "First Name",
          }),
          columnHelper.accessor("FromUser.LastName", {
            header: "Last Name",
          }),
          columnHelper.accessor("FromUser.Username", {
            header: "Username",
          }),
        ],
      }),
    ],
  });
  return (
    <Skeleton height={150} isLoaded={query.status === "success"}>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Skeleton>
  );
};

export default DataTable;
