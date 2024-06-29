import { useAtomValue } from 'jotai';
import type { ComponentType } from 'react';
import React, { useCallback } from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';
import type { TCollapseHeader } from '../tabView.types';

export function withSetHeightRoot(Component: ComponentType<ViewProps>) {
  return (
    props: ViewProps & Pick<TCollapseHeader, 'collapseHeaderOptions'>
  ) => {
    const { heightRoot } = useAtomValue(syncedScrollableAtomReadOnly);

    const handleLayout = useCallback(
      (e: LayoutChangeEvent) => {
        if (props.collapseHeaderOptions.isCollapseHeader) {
          heightRoot.value = e.nativeEvent.layout.height;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.collapseHeaderOptions]
    );

    return <Component {...props} onLayout={handleLayout} />;
  };
}
