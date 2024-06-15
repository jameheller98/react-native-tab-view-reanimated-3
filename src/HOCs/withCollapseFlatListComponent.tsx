import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import useEnabledScroll from '../hooks/useEnabledScroll';
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

export const FlatListWithCollapse = withCollapseFlatListComponent(FlatList);
