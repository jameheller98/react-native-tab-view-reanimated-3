import React, { useCallback, useContext, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { CollapseHeaderOptionsContext } from '../contexts/CollapseHeaderOptionsContext';
import { SyncedScrollableState } from '../contexts/SyncedScrollableState';
import type { TCollapseHeader } from '../tabView.types';

const CollapseHeader = ({ children, renderHeader }: TCollapseHeader) => {
  const { offsetActiveScrollView, heightHeader } = useContext(
    SyncedScrollableState
  );
  const { minHeightHeader, styleHeaderContainer } = useContext(
    CollapseHeaderOptionsContext
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      heightHeader.value = e.nativeEvent.layout.height;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const styledHeaderCollapseAnimated = useAnimatedStyle(() => {
    const translateY = interpolate(
      offsetActiveScrollView.value,
      [0, heightHeader.value - minHeightHeader],
      [0, -heightHeader.value + minHeightHeader],
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
        styleHeaderContainer,
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
    position: 'absolute',
  },
});
