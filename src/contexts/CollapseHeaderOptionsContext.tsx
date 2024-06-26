import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { TCollapseHeaderOptions } from '../tabView.types';

export const tabViewContextInit: Record<string, TCollapseHeaderOptions> = {};

export const CollapseHeaderOptionsContext = createContext(tabViewContextInit);

export const CollapseHeaderOptionsContextProvider = ({
  children,
  collapseHeaderOptions,
  idTabView,
}: {
  children: ReactNode;
  collapseHeaderOptions: TCollapseHeaderOptions;
  idTabView?: string;
}) => {
  const [state, setState] = useState(tabViewContextInit);

  useEffect(() => {
    if (idTabView) {
      setState((stateData) => ({
        ...stateData,
        [idTabView]: collapseHeaderOptions,
      }));
    }
  }, [idTabView, collapseHeaderOptions]);

  return (
    <CollapseHeaderOptionsContext.Provider value={state}>
      {children}
    </CollapseHeaderOptionsContext.Provider>
  );
};

export const useCollapseHeaderOptionsContext = (
  idTabView?: string
): TCollapseHeaderOptions => {
  const data = useContext(CollapseHeaderOptionsContext);

  return idTabView
    ? data[idTabView]!
    : { frozenTopOffset: 0, isCollapseHeader: false, isStickHeaderOnTop: true };
};
