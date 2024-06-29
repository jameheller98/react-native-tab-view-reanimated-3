import { useAtomValue } from 'jotai';
import { useCallback, type RefObject } from 'react';
import type { FlatList, NativeScrollEvent, ScrollView } from 'react-native';
import {
  runOnJS,
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';
import { useCollapseHeaderOptionsContext } from '../contexts/CollapseHeaderOptionsContext';
import { clamp, getCloser } from '../tabViewUtils';

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>,
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  idTabView?: string,
  handleScrollView?: (event: NativeScrollEvent) => void
) {
  const { frozenTopOffset, isStickHeaderOnTop } =
    useCollapseHeaderOptionsContext(idTabView);
  const { offsetActiveScrollView, heightHeader } = useAtomValue(
    syncedScrollableAtomReadOnly
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
