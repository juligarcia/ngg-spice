import { FC, ReactNode, useEffect, useRef } from "react";
import { useInitializeModels } from "./context/SpiceContext/SpiceContext";
import useOpenFile from "@/hooks/useOpenFile";
import useSaveFile from "@/hooks/useSaveFile";
import { isHotkeyPressed, useHotkeys } from "react-hotkeys-hook";
import { osHotkeys } from "@/utils/hotkeys";
import { useProgramStore } from "@/store/program";
import { useOs } from "./context/OsContext";
import ShortcutsDialog from "./ShortcutsDialog/ShortcutsDialog";
import { Shortcuts } from "@/constants/shortcuts";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const setShortcutsDialogOpen = useProgramStore.use.setShortcutsDialogOpen();

  const { os } = useOs();

  const keydownTimeout = useRef<NodeJS.Timeout | null>(null);

  useInitializeModels();
  useOpenFile();
  useSaveFile();

  const shortcutHotkey = osHotkeys(Shortcuts.ShowShortcuts.osHotKeys, os);

  useHotkeys(shortcutHotkey, () => {
    const timeoutId = setTimeout(() => {
      if (isHotkeyPressed(shortcutHotkey)) {
        setShortcutsDialogOpen(true);
      }
    }, Shortcuts.ShowShortcuts.delay);

    keydownTimeout.current = timeoutId;
  });

  useHotkeys(
    shortcutHotkey,
    () => {
      if (keydownTimeout.current) {
        clearTimeout(keydownTimeout.current);
        keydownTimeout.current = null;
      }

      setShortcutsDialogOpen(false);
    },
    {
      keyup: true
    }
  );

  // If user presses any other key, clear the timeout
  useEffect(() => {
    const handleCancel = (e: KeyboardEvent) => {
      if (e.key !== shortcutHotkey && keydownTimeout.current) {
        clearTimeout(keydownTimeout.current);
        keydownTimeout.current = null;
      }
    };

    window.addEventListener("keypress", handleCancel);

    return () => window.removeEventListener("keypress", handleCancel);
  }, [keydownTimeout]);

  return (
    <>
      <ShortcutsDialog />
      <div className="w-screen h-screen max-w-screen max-h-screen overflow-hidden">
        {children}
      </div>
    </>
  );
};

export default Layout;
