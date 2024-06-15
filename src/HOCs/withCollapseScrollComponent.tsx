import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import type { FlatList, ScrollView } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { ScrollableView } from '../tabView.types';

export function withCollapseScrollComponent<T>(Component: ScrollableView<T>) {
  return memo(
    forwardRef<ScrollView | FlatList<T>, ScrollableView<T> & { key: string }>(
      (props, ref) => {
        const innerScrollRef = useRef<ScrollView | FlatList<T>>(null);
        const { key, ...rest } = props;
        const { activeScrollViewID } = useContext(SyncedScrollableContext);

        useImperativeHandle(ref, () => innerScrollRef.current!, []);

        const handleEnabledScroll = useCallback((isScroll: boolean) => {
          innerScrollRef.current?.setNativeProps({ scrollEnabled: isScroll });
        }, []);

        useAnimatedReaction(
          () => activeScrollViewID.value,
          (cur) => {
            if (cur !== key) {
              runOnJS(handleEnabledScroll)(true);
            } else {
              runOnJS(handleEnabledScroll)(false);
            }
          },
          [key]
        );

        return <Component ref={innerScrollRef} {...rest} />;
      }
    )
  );
}
