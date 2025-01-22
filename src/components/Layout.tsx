import { FC, ReactNode } from "react";
import { useInitializeModels } from "./context/SpiceContext/SpiceContext";
import useOpenFile from "@/hooks/useOpenFile";
import useSaveFile from "@/hooks/useSaveFile";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const {} = useInitializeModels();
  useOpenFile();
  useSaveFile();

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen overflow-hidden">
      {children}
    </div>
  );
};

export default Layout;
