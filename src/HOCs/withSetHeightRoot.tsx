import { useAtomValue } from 'jotai';
import type { ComponentType } from 'react';
import React, { useCallback } from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import type { TCollapseHeader, TTabView } from '../tabView.types';

export function withSetHeightRoot(Component: ComponentType<ViewProps>) {
  return (
    props: ViewProps &
      Pick<TCollapseHeader, 'collapseHeaderOptions'> &
      Pick<TTabView<any>, 'syncScrollableAtom'>
  ) => {
    const { heightRoot } = useAtomValue(props.syncScrollableAtom);

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
