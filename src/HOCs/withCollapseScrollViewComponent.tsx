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

function withCollapseScrollViewComponent(
  Component: ComponentClass<Animated.AnimatedScrollViewProps>
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

      useEnabledScroll(innerScrollRef, id);

      useSyncScroll(innerScrollRef, id, offsetCurrentScroll, idTabView);

      const styleContainerComponent = useAnimatedStyleCollapseScroll(
        contentContainerStyle
      );

      const handleScroll = useHandleScroll(
        offsetCurrentScroll,
        innerScrollRef,
        idTabView,
        handleScrollView
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

export const ScrollViewWithCollapse = withCollapseScrollViewComponent(
  Animated.ScrollView
);
