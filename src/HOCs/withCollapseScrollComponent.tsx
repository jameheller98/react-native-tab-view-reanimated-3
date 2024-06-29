import type { PrimitiveAtom } from 'jotai';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView, type NativeScrollEvent } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import useEnabledScroll from '../hooks/useEnabledScroll';
import useHandleScroll from '../hooks/useHandleScroll';
import useInitScroll from '../hooks/useInitScrollView';
import useAnimatedStyleCollapseScroll from '../hooks/useStyleContainerCollapseScroll';
import useSyncScroll from '../hooks/useSyncScroll';
import type { TStateScrollable } from '../tabView.types';

export function withCollapseScrollComponent(
  Component: ComponentClass<Animated.AnimatedScrollViewProps>,
  syncScrollableAtom: PrimitiveAtom<TStateScrollable>
) {
  return memo(
    forwardRef<
      ScrollView,
      Animated.AnimatedScrollViewProps & {
        id: string;
        idTabView: string;
        handleScroll?: (event: NativeScrollEvent) => void;
      }
    >((props, ref) => {
      const offsetCurrentScroll = useSharedValue(0);
      const innerScrollRef = useRef<ScrollView>(null);
      const {
        id,
        idTabView,
        handleScroll: handleScrollView,
        contentContainerStyle,
        ...rest
      } = props;

      useImperativeHandle(ref, () => innerScrollRef.current!, []);

      useEnabledScroll(innerScrollRef, id, syncScrollableAtom);

      useSyncScroll(innerScrollRef, id, offsetCurrentScroll, idTabView);

      const styleContainerComponent = useAnimatedStyleCollapseScroll(
        contentContainerStyle,
        syncScrollableAtom
      );

      const handleScroll = useHandleScroll(
        offsetCurrentScroll,
        innerScrollRef,
        idTabView,
        syncScrollableAtom,
        handleScrollView
      );

      const handleInitScroll = useInitScroll(
        innerScrollRef,
        id,
        syncScrollableAtom
      );

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
