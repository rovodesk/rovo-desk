import { DefaultReactGridSuggestionItem, GridSuggestionMenuProps } from "@blocknote/react";
import { EmojiPicker as EmojiPickerComponent } from "frimousse";

export function EmojiPicker(
  props?: GridSuggestionMenuProps<DefaultReactGridSuggestionItem>,
) {

  const { columns } = props ?? {};

  return (
    <div className="border rounded-lg shadow-lg p-2 gap-1 grid w-[200px]">
   <EmojiPickerComponent.Root columns={columns}>
      <EmojiPickerComponent.Search />
      <EmojiPickerComponent.Viewport>
        <EmojiPickerComponent.Loading>Loading…</EmojiPickerComponent.Loading>
        <EmojiPickerComponent.Empty>No emoji found.</EmojiPickerComponent.Empty>
        <EmojiPickerComponent.List />
      </EmojiPickerComponent.Viewport>
    </EmojiPickerComponent.Root>
    </div>

  );
}