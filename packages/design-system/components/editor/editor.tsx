import {
  FormattingToolbarController,
  GridSuggestionMenuController,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, BlockNoteSchema, PartialBlock } from "@blocknote/core";
import { useTheme } from "../../context/theme";
import { Toolbar } from "./toolbar";
import { EmojiPicker } from "./emoji-picker";
import { SideMenu } from "./side-menu";
import "./editor.css";
import { cn } from "../../lib/utils";
import * as Y from "yjs";
import {
  CommentsExtension,
  User,
  YjsThreadStore,
  DefaultThreadStoreAuth,
} from "@blocknote/core/comments";

interface RichTextEditorProps {
  onChange: (value: PartialBlock[]) => void;
  onSave: () => void;
  initialContent?: PartialBlock[] | null;
  editable?: boolean;
  className?: string;
  collaborationOptions: {
    doc?: Y.Doc;
    fragmentName?: string;
    provider: any;
    user: {
      id: string;
      name: string;
      color: string;
      username: string;
      avatarUrl: string;
    };
    resolveUsers: (userIds: string[]) => Promise<User[]> | User[];
  };
}

const defaultInitialContent: PartialBlock[] = [
  {
    type: "paragraph",
    content: "Press the '/' key to open the Command Menu",
  },
  {
    type: "paragraph",
    content: "Press the ':' key to open the Emoji Picker",
  },
  {
    type: "paragraph",
    content: "Press the '@' key to open the User Menu",
  },
];

export function RichTextEditor({ onChange, initialContent, editable, className, collaborationOptions }: RichTextEditorProps) {

  const document = collaborationOptions.doc ?? new Y.Doc();
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
  
const isCollab = !!collaborationOptions?.provider;

  // Create A New Editor Instance
const editor: BlockNoteEditor = useCreateBlockNote({
  editable,
  ...(isCollab
    ? {}
    : {
        initialContent: initialContent ?? defaultInitialContent,
      }),
  onEditorContentChange: (editor: { topLevelBlocks: PartialBlock[]; }) => {
    onChange(editor.topLevelBlocks);
  },
  uploadFile: handleUpload,
  collaboration: isCollab
    ? {
        provider: collaborationOptions.provider,
        fragment: document.getXmlFragment(
          collaborationOptions.fragmentName ?? "blocknote"
        ),
        user: collaborationOptions.user,
      }
    : undefined,
  extensions: [
    CommentsExtension({
      threadStore: new YjsThreadStore(
		collaborationOptions.user.id,
		document.getMap("threads"),
		new DefaultThreadStoreAuth(collaborationOptions.user.id, "editor"),
	),
      resolveUsers: async (userIds: string[]) => {
		const users = await collaborationOptions.resolveUsers(userIds);
		return users;
	  },
      schema: BlockNoteSchema.create(),
    })
  ]
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
        className={cn("notion-editor", className)}
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