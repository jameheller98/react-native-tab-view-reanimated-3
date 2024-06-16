import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';
import useEnabledScroll from '../hooks/useEnabledScroll';
import useHandleScroll from '../hooks/useHandleScroll';
import useAnimatedStyleCollapseScroll from '../hooks/useStyleContainerCollapseScroll';

function withCollapseFlatListComponent<T>(
  Component: ComponentClass<FlatListProps<T>>
) {
  return memo(
    forwardRef<FlatList, FlatListProps<T> & { id: string }>((props, ref) => {
      const innerScrollRef = useRef<FlatList>(null);
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
    })
  );
}

export const FlatListWithCollapse = withCollapseFlatListComponent(
  Animated.FlatList as any
);
