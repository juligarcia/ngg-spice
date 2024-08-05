import { FC } from "react";
import { motion } from "framer-motion";

import IconSidebarOption, {
  IconSidebarOptionProps as Option
} from "./components/IconSidebarOption";
import clsx from "clsx";

interface IconSidebarProps {
  top: Option[];
  bottom?: Option[];
  minimized?: boolean;
  className?: string;
}

const IconSidebar: FC<IconSidebarProps> = ({
  top,
  bottom,
  minimized,
  className
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: minimized ? 50 : 90 }}
      className={clsx(
        "h-full p-2 flex flex-col gap-2 justify-between",
        className
      )}
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
