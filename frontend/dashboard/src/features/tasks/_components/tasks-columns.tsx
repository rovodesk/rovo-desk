import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@zero-heads-lab/design-system/components/data-table";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Checkbox } from "@zero-heads-lab/design-system/components/ui/checkbox";
import { labels, priorities, statuses } from "../data";
import type { Task } from "../data/types";
import { DataTableRowActions } from "./data-table-row-actions";

export const tasksColumns: ColumnDef<Task>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				aria-label="Select all"
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				className="translate-y-[2px]"
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				checked={row.getIsSelected()}
				className="translate-y-[2px]"
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Task" />
		),
		cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		meta: {
			className: "ps-1 max-w-0 w-2/3",
			tdClassName: "ps-4",
		},
		cell: ({ row }) => {
			const label = labels.find((label) => label.value === row.original.label);

			return (
				<div className="flex space-x-2">
					{label && <Badge variant="outline">{label.label}</Badge>}
					<span className="truncate font-medium">{row.getValue("title")}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		meta: { className: "ps-1", tdClassName: "ps-4" },
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue("status")
			);

			if (!status) {
				return null;
			}

			return (
				<div className="flex w-[100px] items-center gap-2">
					{status.icon && (
						<status.icon className="size-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "priority",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Priority" />
		),
		meta: { className: "ps-1", tdClassName: "ps-3" },
		cell: ({ row }) => {
			const priority = priorities.find(
				(priority) => priority.value === row.getValue("priority")
			);

			if (!priority) {
				return null;
			}

			return (
				<div className="flex items-center gap-2">
					{priority.icon && (
						<priority.icon className="size-4 text-muted-foreground" />
					)}
					<span>{priority.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
