import { FC } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useProgramStore } from "@/store/program";
import { Shortcut, ShortcutCateogory, Shortcuts } from "@/constants/shortcuts";
import ShortcutCategoryComponent from "./ShortcutCategory";

const ShortcutsDialog: FC = () => {
  const showShortcutsDialog = useProgramStore.use.showShortcutsDialog();

  const shortcutsByCategory = Object.values(Shortcuts).reduce(
    (map, shortcut) => {
      const shortcuts = map.get(shortcut.category);

      if (!shortcuts) {
        map.set(shortcut.category, [shortcut]);
      } else {
        shortcuts.push(shortcut);
      }

      return map;
    },
    new Map() as Map<ShortcutCateogory, Shortcut[]>
  );

  const circuitElementsShortcuts = shortcutsByCategory.get(
    ShortcutCateogory.CircuitElements
  );

  const editorShortcuts = shortcutsByCategory.get(ShortcutCateogory.Editor);

  const layoutShortcuts = shortcutsByCategory.get(ShortcutCateogory.Layout);

  const miscellanousShortcuts = shortcutsByCategory.get(
    ShortcutCateogory.Miscellanous
  );

  return (
    <Dialog open={showShortcutsDialog}>
      <DialogContent
        hideClose
        className="w-[80vw] h-[80vh] max-w-[80vw] max-h-[80vh]"
      >
        <div className="flex flex-col overflow-auto">
          {circuitElementsShortcuts && (
            <ShortcutCategoryComponent
              shortcuts={circuitElementsShortcuts}
              category={ShortcutCateogory.CircuitElements}
            />
          )}
          {editorShortcuts && (
            <ShortcutCategoryComponent
              shortcuts={editorShortcuts}
              category={ShortcutCateogory.Editor}
            />
          )}
          {layoutShortcuts && (
            <ShortcutCategoryComponent
              shortcuts={layoutShortcuts}
              category={ShortcutCateogory.Layout}
            />
          )}
          {miscellanousShortcuts && (
            <ShortcutCategoryComponent
              shortcuts={miscellanousShortcuts}
              category={ShortcutCateogory.Miscellanous}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsDialog;
