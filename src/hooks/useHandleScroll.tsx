import { useCallback, useContext, type RefObject } from 'react';
import type { FlatList, NativeScrollEvent, ScrollView } from 'react-native';
import {
  runOnJS,
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import { useContextTabView } from '../contexts/TabViewContext';
import { clamp, getCloser } from '../tabViewUtils';

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>,
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  handleScrollView?: (event: NativeScrollEvent) => void
) {
  const {
    collapseHeaderOptions: { frozenTopOffset, isStickHeaderOnTop },
  } = useContextTabView();
  const { offsetActiveScrollView, heightHeader } = useContext(
    SyncedScrollableContext
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
        handleScrollView && runOnJS(handleScrollView)(event);

        if (!isStickHeaderOnTop) {
          const diff = event.contentOffset.y - offsetCurrentScroll.value;

          offsetActiveScrollView.value = clamp(
            event.contentOffset.y < 0 ? 0 : offsetActiveScrollView.value + diff,
            0,
            heightHeader.value - frozenTopOffset!
          );
        } else if (offsetCurrentScroll.value <= offsetActiveScrollView.value) {
          offsetActiveScrollView.value = clamp(
            event.contentOffset.y < 0 ? 0 : event.contentOffset.y,
            0,
            heightHeader.value - frozenTopOffset!
          );
        }

        offsetCurrentScroll.value = event.contentOffset.y;
      },
      onMomentumEnd: (event) => {
        let offsetY = event.contentOffset.y;

        if (
          !(
            offsetActiveScrollView.value === 0 ||
            offsetActiveScrollView.value ===
              heightHeader.value - frozenTopOffset!
          )
        ) {
          const closer = getCloser(
            offsetActiveScrollView.value,
            heightHeader.value - frozenTopOffset!,
            0
          );

          if (closer === heightHeader.value - frozenTopOffset!) {
            offsetY = offsetY + (heightHeader.value - frozenTopOffset!);
          } else {
            offsetY = offsetY - (heightHeader.value - frozenTopOffset!);
          }

          runOnJS(handleAutoScroll)(offsetY);
        }
      },
    },
    [frozenTopOffset, isStickHeaderOnTop, handleAutoScroll, handleScrollView]
  );

  return scrollHandler;
}
