import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="w-screen h-screen overflow-hidden">{children}</div>;
};

export default Layout;
