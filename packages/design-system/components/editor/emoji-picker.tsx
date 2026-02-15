import { DefaultReactGridSuggestionItem, GridSuggestionMenuProps } from "@blocknote/react";
import { EmojiPicker as EmojiPickerComponent } from "frimousse";

type EmojiPickerProps = GridSuggestionMenuProps<DefaultReactGridSuggestionItem>;

export function EmojiPicker(
  props: EmojiPickerProps,
) {
  return (
    <div className="border rounded-lg shadow-lg p-2 gap-1 grid w-[200px]">
   <EmojiPickerComponent.Root>
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