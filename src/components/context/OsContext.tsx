import { useQuery } from "@tanstack/react-query";
import { OsType, type } from "@tauri-apps/plugin-os";
import { FC, ReactNode, createContext, useContext } from "react";

interface OsContextType {
  os?: OsType;
  isLoading: boolean;
}

const OsContext = createContext<OsContextType>({ isLoading: false });

interface OsContextProviderProps {
  children: ReactNode;
}

export const OsContextProvider: FC<OsContextProviderProps> = ({ children }) => {
  const { data: os, isPending: isLoadingOs } = useQuery({
    queryKey: ["os-type"],
    queryFn: type,
    refetchOnMount: true
  });

  const isLoading = isLoadingOs;

  return (
    <OsContext.Provider value={{ os, isLoading }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = () => {
  const osContext = useContext(OsContext);

  return osContext;
};
