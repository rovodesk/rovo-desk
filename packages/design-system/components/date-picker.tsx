import { Button } from "./ui/button";
import { Calendar } from "./ui/calender";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "./ui/popover";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export interface DatePickerProps {
	selected: Date | undefined;
	onSelect: (date: Date | undefined) => void;
	placeholder?: string;
    maxToToday?: boolean;
    minDate?: Date;
}

export function DatePicker({
	selected,
	onSelect,
	placeholder = "Pick a date",
    maxToToday = true,
    minDate = new Date("1900-01-01"),
}: DatePickerProps) {

    const today = startOfDay(new Date());

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className="w-[240px] justify-start text-start font-normal data-[empty=true]:text-muted-foreground"
					data-empty={!selected}
					variant="outline"
				>
					{selected ? (
						format(selected, "MMM d, yyyy")
					) : (
						<span>{placeholder}</span>
					)}
					<CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					captionLayout="dropdown"
					disabled={(date: Date) =>
						maxToToday && date > today || date < minDate
					}
					mode="single"
					onSelect={onSelect}
					selected={selected}
				/>
			</PopoverContent>
		</Popover>
	);
}