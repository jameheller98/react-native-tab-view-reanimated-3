import React, { useCallback, useContext, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { TCollapseHeader } from '../tabView.types';

const CollapseHeader = ({
  children,
  collapseHeaderOptions,
  renderHeader,
}: TCollapseHeader) => {
  const { heightHeader, offsetActiveScrollView } = useContext(
    SyncedScrollableContext
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (collapseHeaderOptions.isCollapseHeader) {
        heightHeader.value = e.nativeEvent.layout.height;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collapseHeaderOptions]
  );

  const styledHeaderCollapseAnimated = useAnimatedStyle(() => {
    const translateY = interpolate(
      offsetActiveScrollView.value,
      [0, heightHeader.value - collapseHeaderOptions.frozenTopOffset],
      [0, -heightHeader.value + collapseHeaderOptions.frozenTopOffset],
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
        // eslint-disable-next-line react-native/no-inline-styles
        {
          position: collapseHeaderOptions.isCollapseHeader
            ? 'absolute'
            : 'relative',
        },
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
    zIndex: 1,
    width: '100%',
  },
});
