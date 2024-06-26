import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import {
  FlatList,
  type FlatListProps,
  type NativeScrollEvent,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import useEnabledScroll from '../hooks/useEnabledScroll';
import useHandleScroll from '../hooks/useHandleScroll';
import useInitScroll from '../hooks/useInitScrollView';
import useAnimatedStyleCollapseScroll from '../hooks/useStyleContainerCollapseScroll';
import useSyncScroll from '../hooks/useSyncScroll';

function withCollapseFlatListComponent<T>(
  Component: ComponentClass<FlatListProps<T>>
) {
  return memo(
    forwardRef<
      FlatList,
      FlatListProps<T> & {
        id: string;
        idTabView: string;
        handleScroll?: (event: NativeScrollEvent) => void;
      }
    >((props, ref) => {
      const offsetCurrentScroll = useSharedValue(0);
      const innerScrollRef = useRef<FlatList>(null);
      const {
        id,
        idTabView,
        handleScroll: handleScrollFlatList,
        contentContainerStyle,
        ...rest
      } = props;

      useImperativeHandle(ref, () => innerScrollRef.current!, []);

      useEnabledScroll(innerScrollRef, id);

      useSyncScroll(innerScrollRef, id, offsetCurrentScroll, idTabView);

      const styleContainerComponent = useAnimatedStyleCollapseScroll(
        contentContainerStyle
      );

      const handleScroll = useHandleScroll(
        offsetCurrentScroll,
        innerScrollRef,
        idTabView,
        handleScrollFlatList
      );

      const handleInitScroll = useInitScroll(innerScrollRef, id);

      return (
        <Component
          ref={innerScrollRef}
          {...rest}
          onScroll={handleScroll}
          onLayout={handleInitScroll}
          contentContainerStyle={styleContainerComponent}
          scrollEventThrottle={16}
        />
      );
    })
  );
}

export const FlatListWithCollapse = withCollapseFlatListComponent(
  Animated.FlatList as any
);
