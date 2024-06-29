import { createContext } from 'react';
import type { TCollapseHeaderOptions } from '../tabView.types';

export const CollapseHeaderOptionsContext =
  createContext<TCollapseHeaderOptions>({
    isSnap: false,
    minHeightHeader: 0,
    revealHeaderOnScroll: false,
    styleHeaderContainer: undefined,
  });
