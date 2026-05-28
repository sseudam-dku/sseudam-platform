import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  responsive?: "table" | "card";
}

export function Table({ className, responsive = "table", children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "border-border w-full overflow-x-auto rounded-lg border",
        responsive === "card" &&
          "[&_[data-slot=table-row]]:block sm:[&_[data-slot=table-row]]:table-row",
      )}
      data-responsive={responsive}>
      <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-border bg-surface-muted border-b [&_tr]:border-b",
        "[div[data-responsive=card]_&]:hidden sm:[div[data-responsive=card]_&]:table-header-group",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-border hover:bg-surface-muted/60 border-b transition-colors",
        "[div[data-responsive=card]_&]:bg-surface [div[data-responsive=card]_&]:mb-3 [div[data-responsive=card]_&]:rounded-lg [div[data-responsive=card]_&]:border [div[data-responsive=card]_&]:p-4 [div[data-responsive=card]_&]:last:mb-0 sm:[div[data-responsive=card]_&]:mb-0 sm:[div[data-responsive=card]_&]:rounded-none sm:[div[data-responsive=card]_&]:border-0 sm:[div[data-responsive=card]_&]:border-b sm:[div[data-responsive=card]_&]:bg-transparent sm:[div[data-responsive=card]_&]:p-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "text-muted h-11 px-4 text-left align-middle text-xs font-semibold tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  label?: string;
}

export function TableCell({ className, label, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "text-foreground px-4 py-3 align-middle",
        "[div[data-responsive=card]_&]:before:text-muted [div[data-responsive=card]_&]:flex [div[data-responsive=card]_&]:items-center [div[data-responsive=card]_&]:justify-between [div[data-responsive=card]_&]:px-0 [div[data-responsive=card]_&]:py-2 [div[data-responsive=card]_&]:before:mr-4 [div[data-responsive=card]_&]:before:shrink-0 [div[data-responsive=card]_&]:before:text-xs [div[data-responsive=card]_&]:before:font-medium [div[data-responsive=card]_&]:before:content-[attr(data-label)] sm:[div[data-responsive=card]_&]:table-cell sm:[div[data-responsive=card]_&]:px-4 sm:[div[data-responsive=card]_&]:py-3 sm:[div[data-responsive=card]_&]:before:content-none",
        className,
      )}
      data-label={label}
      {...props}>
      {children}
    </td>
  );
}
