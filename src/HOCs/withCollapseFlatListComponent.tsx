import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  type ComponentClass,
} from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';

function withCollapseScrollViewComponent(
  Component: ComponentClass<ScrollViewProps>
) {
  return memo(
    forwardRef<ScrollView, ScrollViewProps & { id: string }>((props, ref) => {
      const innerScrollRef = useRef<ScrollView>(null);
      const { id, ...rest } = props;
      const { activeScrollViewID } = useContext(SyncedScrollableContext);

      useImperativeHandle(ref, () => innerScrollRef.current!, []);

      const handleEnabledScroll = useCallback((isScroll: boolean) => {
        innerScrollRef.current?.setNativeProps({ scrollEnabled: isScroll });
      }, []);

      useAnimatedReaction(
        () => activeScrollViewID.value,
        (cur, prev) => {
          if (prev === null) return;

          if (cur === id) {
            runOnJS(handleEnabledScroll)(true);
          } else {
            runOnJS(handleEnabledScroll)(false);
          }
        },
        [id]
      );

      return <Component ref={innerScrollRef} {...rest} />;
    })
  );
}

export const FlatListWithCollapse = withCollapseScrollViewComponent(ScrollView);
