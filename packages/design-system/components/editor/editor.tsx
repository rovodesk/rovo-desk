import {
  FormattingToolbarController,
  GridSuggestionMenuController,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useTheme } from "../../context/theme";
import { Toolbar } from "./toolbar";
import { EmojiPicker } from "./emoji-picker";
import { SideMenu } from "./side-menu";
import "./editor.css";
import { cn } from "../../lib/utils";

interface RichTextEditorProps {
  onChange: (value: PartialBlock[]) => void;
  onSave: () => void;
  initialContent?: PartialBlock[] | null;
  editable?: boolean;
  className?: string;
}

const defaultInitialContent: PartialBlock[] = [
  {
    type: "paragraph",
    content: "Welcome to this demo!",
  },
  {
    type: "paragraph",
    content: "Press the ':' key to open the Emoji Picker",
  },
  {
    type: "paragraph",
    content: "It's been replaced with a custom component",
  },
  {
    type: "paragraph",
  },
];

export function RichTextEditor({ onChange, initialContent, editable, className }: RichTextEditorProps) {

  const { resolvedTheme } = useTheme();

  // Handle Upload
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  // Create A New Editor Instance
  const editor: BlockNoteEditor = useCreateBlockNote({
    editable,
    initialContent: initialContent ?? defaultInitialContent,
    onEditorContentChange: (editor: { topLevelBlocks: PartialBlock[]; }) => {
      onChange(editor.topLevelBlocks);
    },
    uploadFile: handleUpload,
  });

  // Render the editor
  return (
    <div className={cn("mx-auto", className)}>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme}
        formattingToolbar={false}
        emojiPicker={false}
        sideMenu={false}
        className="notion-editor"
      >
        <FormattingToolbarController formattingToolbar={() => <Toolbar />} />
        <GridSuggestionMenuController
        triggerCharacter={":"}
          gridSuggestionMenuComponent={EmojiPicker}
          columns={20}
        />
        <SideMenuController sideMenu={(props) => 
          <SideMenu {...props} />} 
        />
      </BlockNoteView>
    </div>
  )
}

export default RichTextEditor;