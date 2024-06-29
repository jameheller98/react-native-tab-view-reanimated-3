import { useCallback, useContext, type RefObject } from 'react';
import type { FlatList, NativeScrollEvent, ScrollView } from 'react-native';
import {
  runOnJS,
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { CollapseHeaderOptionsContext } from '../contexts/CollapseHeaderOptionsContext';
import { SyncedScrollableState } from '../contexts/SyncedScrollableState';
import { clamp, getCloser } from '../tabViewUtils';

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>,
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  handleScrollView?: (event: NativeScrollEvent) => void
) {
  const { minHeightHeader, isSnap, revealHeaderOnScroll } = useContext(
    CollapseHeaderOptionsContext
  );
  const { offsetActiveScrollView, heightHeader } = useContext(
    SyncedScrollableState
  );

  const handleAutoScroll = useCallback(
    (offsetY: number) => {
      if (!innerScrollRef.current) return;

      (innerScrollRef.current as ScrollView)?.scrollTo?.({
        y: offsetY,
      });
      (innerScrollRef.current as FlatList)?.scrollToOffset?.({
        offset: offsetY,
      });
    },
    [innerScrollRef]
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        handleScrollView?.(event);

        if (revealHeaderOnScroll) {
          const diff = event.contentOffset.y - offsetCurrentScroll.value;

          offsetActiveScrollView.value = clamp(
            event.contentOffset.y < 0 ? 0 : offsetActiveScrollView.value + diff,
            0,
            heightHeader.value - minHeightHeader
          );
        } else if (offsetCurrentScroll.value <= offsetActiveScrollView.value) {
          offsetActiveScrollView.value = clamp(
            event.contentOffset.y < 0 ? 0 : event.contentOffset.y,
            0,
            heightHeader.value - minHeightHeader
          );
        }

        offsetCurrentScroll.value = event.contentOffset.y;
      },
      onMomentumEnd: (event) => {
        if (!isSnap) return;

        let offsetY = event.contentOffset.y;

        if (
          !(
            offsetActiveScrollView.value === 0 ||
            offsetActiveScrollView.value ===
              heightHeader.value - minHeightHeader
          )
        ) {
          const closer = getCloser(
            offsetActiveScrollView.value,
            heightHeader.value - minHeightHeader,
            0
          );

          if (closer === heightHeader.value - minHeightHeader) {
            offsetY = offsetY + (heightHeader.value - minHeightHeader);
          } else {
            offsetY = offsetY - (heightHeader.value - minHeightHeader);
          }

          runOnJS(handleAutoScroll)(offsetY);
        }
      },
    },
    [
      minHeightHeader,
      isSnap,
      revealHeaderOnScroll,
      handleAutoScroll,
      handleScrollView,
    ]
  );

  return scrollHandler;
}
