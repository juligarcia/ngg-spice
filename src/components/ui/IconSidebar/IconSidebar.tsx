import { FC } from "react";
import { motion } from "framer-motion";

import IconSidebarOption, {
  IconSidebarOptionProps as Option
} from "./components/IconSidebarOption";

interface IconSidebarProps {
  top: Option[];
  bottom?: Option[];
  minimized?: boolean;
}

const IconSidebar: FC<IconSidebarProps> = ({ top, bottom, minimized }) => {
  return (
    <motion.div
      animate={{ width: "auto" }}
      className="h-full px-2 py-4 border-r-2 flex flex-col gap-2 justify-between max-w-fit"
    >
      <div className="flex flex-col gap-2">
        {top.map((option) => (
          <IconSidebarOption
            minimized={minimized}
            key={option.ariaLabel}
            {...option}
          />
        ))}
      </div>

      {bottom && (
        <div className="flex flex-col gap-2">
          {bottom.map((option) => (
            <IconSidebarOption
              minimized={minimized}
              key={option.ariaLabel}
              {...option}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default IconSidebar;
