import { api } from "@/utils/api";
import { parse } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

interface ConfigContextInterface {
  config: Record<string, any>;
}

export const ConfigContext = React.createContext<ConfigContextInterface>({
  config: {},
});

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: config } = api.misc.getConfig.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <ConfigContext.Provider value={{ config: config ? config : {} }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }
  return context;
};
