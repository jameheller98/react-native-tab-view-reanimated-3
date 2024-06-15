import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedStyleCollapseScroll from '../hooks/useAnimatedStyleCollapseScroll';
import useEnabledScroll from '../hooks/useEnabledScroll';

function withCollapseScrollViewComponent(
  Component: ComponentClass<ScrollViewProps>
) {
  return memo(
    forwardRef<ScrollView, ScrollViewProps & { id: string }>((props, ref) => {
      const innerScrollRef = useRef<ScrollView>(null);
      const { id, contentContainerStyle, ...rest } = props;

      useImperativeHandle(ref, () => innerScrollRef.current!, []);

      useEnabledScroll(innerScrollRef, id);
      const animatedStyleComponent = useAnimatedStyleCollapseScroll(
        contentContainerStyle
      );

      return (
        <Component
          ref={innerScrollRef}
          {...rest}
          style={[contentContainerStyle, animatedStyleComponent]}
          scrollEventThrottle={16}
        />
      );
    })
  );
}

export const ScrollViewWithCollapse = withCollapseScrollViewComponent(
  Animated.ScrollView
);
