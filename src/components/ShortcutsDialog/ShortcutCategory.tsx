import {
  Shortcut,
  ShortcutCateogory,
  ShortcutCateogoryDisplay
} from "@/constants/shortcuts";
import { FC } from "react";
import { Typography } from "../ui/Typography";
import ShortcutItem from "./ShortcutItem";

interface ShortcutCategoryProps {
  shortcuts: Shortcut[];
  category: ShortcutCateogory;
}

const ShortcutCategory: FC<ShortcutCategoryProps> = ({
  category,
  shortcuts
}) => {
  return (
    <div className="[&+div]:mt-6 [&+div]:pt-6 [&+div]:border-t-2">
      <Typography className="mb-8" variant="h3">
        {ShortcutCateogoryDisplay[category]}
      </Typography>
      <div className="grid grid-cols-3 gap-4">
        {shortcuts.map((shortcut) => (
          <ShortcutItem key={shortcut.functionality} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
};

export default ShortcutCategory;
