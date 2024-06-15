import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import useEnabledScroll from '../hooks/useEnabledScroll';
import useAnimatedStyleCollapseScroll from '../hooks/useStyleContainerCollapseScroll';

function withCollapseScrollViewComponent(
  Component: ComponentClass<ScrollViewProps>
) {
  return memo(
    forwardRef<ScrollView, ScrollViewProps & { id: string }>((props, ref) => {
      const innerScrollRef = useRef<ScrollView>(null);
      const { id, contentContainerStyle, ...rest } = props;

      useImperativeHandle(ref, () => innerScrollRef.current!, []);

      useEnabledScroll(innerScrollRef, id);

      const styleContainerComponent = useAnimatedStyleCollapseScroll(
        contentContainerStyle
      );

      return (
        <Component
          ref={innerScrollRef}
          {...rest}
          contentContainerStyle={styleContainerComponent}
          scrollEventThrottle={16}
        />
      );
    })
  );
}

export const ScrollViewWithCollapse =
  withCollapseScrollViewComponent(ScrollView);
