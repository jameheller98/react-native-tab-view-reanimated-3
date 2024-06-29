import { useAtomValue } from 'jotai';
import React, { memo, useCallback } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import type { TCollapseHeader, TTabBar, TTabView } from '../tabView.types';
import { TabBar } from './TabBar';

const WrapperTabBar = <T,>(
  props: TTabBar<T> &
    Pick<TTabView<T>, 'renderTabBar'> &
    Pick<TCollapseHeader, 'collapseHeaderOptions' | 'syncScrollableAtom'>
) => {
  const { heightTabBar } = useAtomValue(props.syncScrollableAtom);
  const { renderTabBar, collapseHeaderOptions, ...rest } = props;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (collapseHeaderOptions.isCollapseHeader) {
        heightTabBar.value = e.nativeEvent.layout.height;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collapseHeaderOptions]
  );

  return (
    <View onLayout={handleLayout} collapsable={false}>
      {renderTabBar ? renderTabBar(rest) : <TabBar {...rest} />}
    </View>
  );
};

export default memo(WrapperTabBar) as typeof WrapperTabBar;
