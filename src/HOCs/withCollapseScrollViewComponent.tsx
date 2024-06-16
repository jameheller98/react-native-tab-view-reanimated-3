import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView } from 'react-native';
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
    forwardRef<ScrollView, Animated.AnimatedScrollViewProps & { id: string }>(
      (props, ref) => {
        const offsetCurrentScroll = useSharedValue(0);
        const innerScrollRef = useRef<ScrollView>(null);
        const { id, contentContainerStyle, ...rest } = props;

        useImperativeHandle(ref, () => innerScrollRef.current!, []);

        useEnabledScroll(innerScrollRef, id);

        useSyncScroll(innerScrollRef, id, offsetCurrentScroll);

        const styleContainerComponent = useAnimatedStyleCollapseScroll(
          contentContainerStyle
        );

        const handleScroll = useHandleScroll(offsetCurrentScroll);

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
      }
    )
  );
}

export const ScrollViewWithCollapse = withCollapseScrollViewComponent(
  Animated.ScrollView
);
