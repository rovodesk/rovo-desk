import "@blocknote/shadcn/style.css";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorState,
  useSelectedBlocks,
} from "@blocknote/react";
import { MessageCircleIcon } from "lucide-react";
import { toast } from "sonner";

export function CommentButton() {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext()!;

  // Tracks whether the text & background are both blue.
  const isSelected = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor.getActiveStyles().textColor === "blue" &&
      editor.getActiveStyles().backgroundColor === "blue",
  });

  // Doesn't render unless a at least one block with inline content is
  // selected. You can use a similar pattern of returning `null` to
  // conditionally render buttons based on the editor state.
  const blocks = useSelectedBlocks();
  if (blocks.filter((block) => block.content !== undefined).length === 0) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Add Comment"}
      onClick={() => {
        toast.success("Comment added successfully");
      }}
      isSelected={isSelected}
    >
      <MessageCircleIcon className="size-4" />
      <span className="sr-only">Add Comment</span>
    </Components.FormattingToolbar.Button>
  );
}
