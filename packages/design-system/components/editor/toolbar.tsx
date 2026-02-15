import { BasicTextStyleButton, BlockTypeSelect, ColorStyleButton, CreateLinkButton, FileCaptionButton, FileReplaceButton, FormattingToolbar, NestBlockButton, TextAlignButton, UnnestBlockButton, useCreateBlockNote } from "@blocknote/react";
import { CommentButton } from "./comment-button";

export const Toolbar = () => {
  return (
    <div className="bg-background shadow-md rounded-md px-2 py-1">
      <FormattingToolbar>
        <BlockTypeSelect />

        <BasicTextStyleButton basicTextStyle="bold" />
        <BasicTextStyleButton basicTextStyle="italic" />
        <BasicTextStyleButton basicTextStyle="underline" />
        <BasicTextStyleButton basicTextStyle="strike" />
        <BasicTextStyleButton basicTextStyle="code" />

        <ColorStyleButton />

        <CreateLinkButton />
      </FormattingToolbar>
    </div>
  );
};


export default FormattingToolbar