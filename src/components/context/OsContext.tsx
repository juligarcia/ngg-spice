import { useQuery } from "@tanstack/react-query";
import { OsType, type } from "@tauri-apps/api/os";
import { FC, ReactNode, createContext, useContext, useEffect } from "react";

interface OsContextType {
  os?: OsType;
  isLoading: boolean;
}

const OsContext = createContext<OsContextType>({ isLoading: false });

interface OsContextProviderProps {
  children: ReactNode;
}

export const OsContextProvider: FC<OsContextProviderProps> = ({ children }) => {
  const {
    data: os,
    isPending: isLoadingOs,
    refetch
  } = useQuery({
    queryKey: ["os-type"],
    queryFn: type,
    refetchOnMount: true
  });

  useEffect(() => {
    refetch();
  }, []);

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
