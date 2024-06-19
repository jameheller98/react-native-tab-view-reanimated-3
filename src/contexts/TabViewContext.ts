import { createContext, useContext } from 'react';
import type { TTabViewContext } from '../tabView.types';

export const tabViewContextInit: TTabViewContext = {
  collapseHeaderOptions: {},
};

export const TabViewContext = createContext(tabViewContextInit);

export const useContextTabView = () => {
  const context = useContext(TabViewContext);
  const defaultCollapseHeaderOptions = Object.assign(
    {
      frozenTopOffset: 0,
      isStickHeaderOnTop: true,
      isCollapseHeader: false,
    } as NonNullable<TTabViewContext['collapseHeaderOptions']>,
    context.collapseHeaderOptions
  );

  return { ...context, collapseHeaderOptions: defaultCollapseHeaderOptions };
};
