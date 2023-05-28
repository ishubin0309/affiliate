import { api } from "@/utils/api";
import { parse } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/common/Loading";

interface ConfigContextInterface {
  config: Record<string, any>;
}

export const ConfigContext = React.createContext<ConfigContextInterface>({
  config: {},
});

export const ConfigProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Record<string, any>;
}) => {
  return config ? (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  ) : (
    <Loading />
  );
};

export const useConfigContext = () => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }
  return context;
};
