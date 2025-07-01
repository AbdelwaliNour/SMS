import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTablePagination } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  searchable?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  searchable = true,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border shadow bg-white dark:bg-gray-900">
        <Table>
          <TableHeader className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 dark:from-slate-800 dark:via-blue-900/30 dark:to-slate-800 border-b-3 border-blue-200 dark:border-blue-800 sticky top-0 z-10 shadow-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gradient-to-r hover:from-blue-100/50 hover:via-slate-100/50 hover:to-blue-100/50 dark:hover:from-blue-900/20 dark:hover:via-slate-800/50 dark:hover:to-blue-900/20 transition-all duration-300">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-black text-slate-800 dark:text-slate-100 py-8 px-8 text-lg tracking-tight bg-gradient-to-b from-white/80 via-slate-50/90 to-white/80 dark:from-slate-700/80 dark:via-slate-800/90 dark:to-slate-700/80 border-r-2 border-slate-200/50 dark:border-slate-600/50 last:border-r-0 shadow-inner backdrop-blur-sm">
                      <div className="flex items-center space-x-3 min-h-[24px]">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-divider dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-black dark:text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
