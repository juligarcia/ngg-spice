import { keysToSpecialCharacterMapper, Shortcut } from "@/constants/shortcuts";
import { osHotkeys } from "@/utils/hotkeys";
import { FC } from "react";
import { useOs } from "../context/OsContext";
import { Typography } from "../ui/Typography";
import { capitalize } from "@/utils/string";

interface ShortcutItemProps {
  shortcut: Shortcut;
}

const ShortcutItem: FC<ShortcutItemProps> = ({ shortcut }) => {
  const { os } = useOs();

  const keybinds = osHotkeys(shortcut.osHotKeys, os);

  const parseKeybind = (keybind: string) => {
    const lowercaseKeybind = keybind.toLowerCase();

    const split = lowercaseKeybind.split("+");

    if (split.length === 1) {
      const specialCharacter = keysToSpecialCharacterMapper[lowercaseKeybind];

      return capitalize(
        specialCharacter
          ? (osHotkeys(specialCharacter, os) as string)
          : lowercaseKeybind
      );
    }

    return split
      .map((key) => {
        const lowercaseKeybind = key.toLowerCase();
        const specialCharacter = keysToSpecialCharacterMapper[lowercaseKeybind];

        return capitalize(
          specialCharacter ? (osHotkeys(specialCharacter, os) as string) : key
        );
      })
      .join(" + ");
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="p-2 border-2 min-w-12 text-center rounded-md">
        {typeof keybinds === "string" ? (
          <Typography variant="xsmall" className="font-bold whitespace-nowrap">
            {parseKeybind(keybinds)}
          </Typography>
        ) : (
          keybinds.map((keybind) => (
            <Typography
              variant="xsmall"
              className="font-bold whitespace-nowrap"
              key={keybind}
            >
              {parseKeybind(keybind)}
            </Typography>
          ))
        )}
      </div>
      <Typography variant="xsmall">{`${shortcut.functionality}${
        shortcut.specialIndication ? `, ${shortcut.specialIndication}` : ""
      }${
        !!shortcut.delay
          ? ` (Hold for ${(shortcut.delay / 1000).toFixed(1)}s)`
          : ""
      }`}</Typography>
    </div>
  );
};

export default ShortcutItem;
