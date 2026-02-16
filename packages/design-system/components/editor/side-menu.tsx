import { SideMenuProps, DragHandleMenu, BlockColorsItem, DragHandleButton, SideMenu as BlockNoteSideMenu, AddBlockButton } from '@blocknote/react'

import { SideMenuExtension } from "@blocknote/core/extensions";
import {
  useBlockNoteEditor,
  useComponentsContext,
  useExtensionState,
} from "@blocknote/react";
import { ArrowDown, ArrowDownIcon, ArrowUpIcon, DotSquareIcon, PlusIcon, SquareDotIcon, Trash2Icon } from "lucide-react";
import { Button } from '../ui/button';

function RemoveBlockButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const block = useExtensionState(SideMenuExtension, {
    selector: (state) => state?.block,
  });

  if (!block) return null;

  return (
    <Components.SideMenu.Button
      label="Delete"
      className="flex items-center justify-center rounded-md 
                 hover:bg-red-50 hover:text-red-600 transition-colors"
      icon={
        <Trash2Icon
          size={16}
          onClick={() => editor.removeBlocks([block])}
        />
      }
    />
  );
}

function ResetBlockTypeItem(props: { children: React.ReactNode }) {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext()!;

  const block = useExtensionState(SideMenuExtension, {
    selector: (state) => state?.block,
  });

  if (!block) {
    return null;
  }

  return (
    <Components.Generic.Menu.Item
      onClick={() => {
        editor.updateBlock(block, { type: "paragraph" });
      }}
    >
      {props.children}
    </Components.Generic.Menu.Item>
  );
}


export const DragMenu = () => {
  const editor = useBlockNoteEditor();
    const Components = useComponentsContext()!;
  
  const block = useExtensionState(SideMenuExtension, {
    selector: (state) => state?.block,
  });

  if (!block) {
    return null;
  }

  return (
    <DragHandleMenu>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
        <Components.Generic.Menu.Item
          onClick={() =>
        editor.moveBlocksUp()
      }>
        <ArrowUpIcon size={16}/>
        <span className='text-muted-foreground text-xs'>Move Up</span>
      </Components.Generic.Menu.Item>
      <Components.Generic.Menu.Item onClick={() =>
        editor.moveBlocksDown()
      }>
        <ArrowDownIcon size={16}/>
        <span className='text-muted-foreground text-xs'>Move Down</span>
      </Components.Generic.Menu.Item>
      </div>
      <ResetBlockTypeItem>Reset Block</ResetBlockTypeItem>
      <RemoveBlockButton />
      </div>
  </DragHandleMenu>
  )
};


export const SideMenu = (props?: Omit<SideMenuProps, "dragHandleMenu">) => {
  return (
    <BlockNoteSideMenu>
      <AddBlockButton />
      <DragHandleButton
        dragHandleMenu={DragMenu}
      >
        <SquareDotIcon className='text-muted-foreground'/>
      </DragHandleButton>
    </BlockNoteSideMenu>
  );
};


