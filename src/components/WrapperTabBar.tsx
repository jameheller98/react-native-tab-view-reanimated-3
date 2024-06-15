import React, { memo, useCallback, useContext } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { TTabBar, TTabView } from '../tabView.types';
import { TabBar } from './TabBar';

const WrapperTabBar = <T,>(
  props: TTabBar<T> & Pick<TTabView<T>, 'renderTabBar'>
) => {
  const { heightTabBar } = useContext(SyncedScrollableContext);
  const { renderTabBar, ...rest } = props;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) =>
      (heightTabBar.value = e.nativeEvent.layout.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View onLayout={handleLayout} collapsable={false}>
      {renderTabBar ? renderTabBar(rest) : <TabBar {...rest} />}
    </View>
  );
};

export default memo(WrapperTabBar) as typeof WrapperTabBar;
