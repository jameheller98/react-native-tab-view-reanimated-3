import type { ComponentType } from 'react';
import React, { useCallback, useContext } from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';

export function withSetHeightRoot(Component: ComponentType<ViewProps>) {
  return (props: ViewProps) => {
    const { heightRoot } = useContext(SyncedScrollableContext);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
      heightRoot.value = e.nativeEvent.layout.height;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Component {...props} onLayout={handleLayout} />;
  };
}
