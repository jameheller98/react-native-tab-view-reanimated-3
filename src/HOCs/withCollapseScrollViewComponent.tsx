import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import useEnabledScroll from '../hooks/useEnabledScroll';
import useHandleScroll from '../hooks/useHandleScroll';
import useAnimatedStyleCollapseScroll from '../hooks/useStyleContainerCollapseScroll';

function withCollapseScrollViewComponent(
  Component: ComponentClass<Animated.AnimatedScrollViewProps>
) {
  return memo(
    forwardRef<ScrollView, Animated.AnimatedScrollViewProps & { id: string }>(
      (props, ref) => {
        const innerScrollRef = useRef<ScrollView>(null);
        const { id, contentContainerStyle, ...rest } = props;

        useImperativeHandle(ref, () => innerScrollRef.current!, []);

        useEnabledScroll(innerScrollRef, id);

        const styleContainerComponent = useAnimatedStyleCollapseScroll(
          contentContainerStyle
        );

        const handleScroll = useHandleScroll();

        return (
          <Component
            ref={innerScrollRef}
            {...rest}
            onScroll={handleScroll}
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
