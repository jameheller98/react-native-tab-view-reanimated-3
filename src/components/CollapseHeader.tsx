import React, { useCallback, useContext, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { TCollapseHeader } from '../tabView.types';

const CollapseHeader = ({ children, renderHeader }: TCollapseHeader) => {
  const { heightHeader } = useContext(SyncedScrollableContext);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) =>
      (heightHeader.value = e.nativeEvent.layout.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Animated.View style={styles.container}>
      <View onLayout={handleLayout} collapsable={false}>
        {renderHeader()}
      </View>
      {children as ReactNode}
    </Animated.View>
  );
};

export default CollapseHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
});
