import { FC } from "react";
import ThemeToggle from "./ThemeToggle";

const NavBar: FC = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b-2 border-b-border p-3">
      <div className="w-8 h-8">
        <img src="/logo.png" alt="NGG Spice logo" />
      </div>

      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
