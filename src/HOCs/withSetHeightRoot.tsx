import type { ComponentType } from 'react';
import React, { useCallback, useContext } from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { TCollapseHeader } from '../tabView.types';

export function withSetHeightRoot(Component: ComponentType<ViewProps>) {
  return (
    props: ViewProps & Pick<TCollapseHeader, 'collapseHeaderOptions'>
  ) => {
    const { heightRoot } = useContext(SyncedScrollableContext);

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
