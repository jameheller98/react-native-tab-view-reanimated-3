import React, { useCallback, useContext, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import { useContextTabView } from '../contexts/TabViewContext';
import type { TCollapseHeader } from '../tabView.types';

const CollapseHeader = ({ children, renderHeader }: TCollapseHeader) => {
  const { collapseHeaderOptions } = useContextTabView();
  const { heightHeader, offsetActiveScrollView } = useContext(
    SyncedScrollableContext
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) =>
      (heightHeader.value = e.nativeEvent.layout.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const styledHeaderCollapseAnimated = useAnimatedStyle(() => {
    const translateY = interpolate(
      offsetActiveScrollView.value,
      [0, heightHeader.value - collapseHeaderOptions!.frozenTopOffset!],
      [0, -heightHeader.value + collapseHeaderOptions!.frozenTopOffset!],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    } as any;
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        collapseHeaderOptions.styleHeaderContainer,
        styledHeaderCollapseAnimated,
      ]}
    >
      <View onLayout={handleLayout} collapsable={false}>
        {renderHeader({ offsetActiveScrollView })}
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
