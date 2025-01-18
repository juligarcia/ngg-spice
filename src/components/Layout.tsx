import { FC, ReactNode } from "react";
import { useInitializeModels } from "./context/SpiceContext/SpiceContext";
import useOpenFile from "@/hooks/useOpenFile";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const {} = useInitializeModels();
  useOpenFile();

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen overflow-hidden">
      {children}
    </div>
  );
};

export default Layout;
