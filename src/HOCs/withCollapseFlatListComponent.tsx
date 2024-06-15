import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedStyleCollapseScroll from '../hooks/useAnimatedStyleCollapseScroll';
import useEnabledScroll from '../hooks/useEnabledScroll';

function withCollapseFlatListComponent<T>(
  Component: ComponentClass<FlatListProps<T>>
) {
  return memo(
    forwardRef<FlatList, FlatListProps<T> & { id: string }>((props, ref) => {
      const innerScrollRef = useRef<FlatList>(null);
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

export const FlatListWithCollapse = withCollapseFlatListComponent(
  Animated.FlatList as any
);
