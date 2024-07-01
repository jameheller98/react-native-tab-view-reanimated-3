import { useCallback, useContext, type RefObject } from 'react';
import {
  Platform,
  type FlatList,
  type NativeScrollEvent,
  type ScrollView,
} from 'react-native';
import {
  Extrapolation,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { CollapseHeaderOptionsContext } from '../contexts/CollapseHeaderOptionsContext';
import { SyncedScrollableState } from '../contexts/SyncedScrollableState';
import { clamp, getCloser } from '../tabViewUtils';

const IS_IOS = Platform.OS === 'ios';
const ONE_FRAME_MS = 16;

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>,
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  handleScrollView?: (event: NativeScrollEvent) => void
) {
  const { minHeightHeader, isSnap, revealHeaderOnScroll } = useContext(
    CollapseHeaderOptionsContext
  );
  const { offsetActiveScrollView, heightHeader, heightRoot } = useContext(
    SyncedScrollableState
  );
  const afterDrag = useSharedValue(0);

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

  const onMomentumEnd = useCallback(
    (event: NativeScrollEvent) => {
      'worklet';
      if (!isSnap) return;

      let offsetY = event.contentOffset.y;

      if (
        !(
          offsetActiveScrollView.value === 0 ||
          offsetActiveScrollView.value === heightHeader.value - minHeightHeader
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSnap, handleAutoScroll, minHeightHeader]
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onBeginDrag: () => {
        if (IS_IOS) cancelAnimation(afterDrag);
      },
      onMomentumBegin: () => {
        if (IS_IOS) cancelAnimation(afterDrag);
      },
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

        const clampMax =
          event.contentSize.height -
          (heightRoot.value || 0) +
          event.contentInset.top;

        offsetCurrentScroll.value = interpolate(
          event.contentOffset.y,
          [0, clampMax],
          [0, clampMax],
          Extrapolation.CLAMP
        );
      },
      onEndDrag: (event) => {
        if (IS_IOS) {
          // we delay this by one frame so that onMomentumBegin may fire on iOS
          afterDrag.value = withDelay(
            ONE_FRAME_MS,
            withTiming(0, { duration: 0 }, (isFinished) => {
              // if the animation is finished, the onMomentumBegin has
              // never started, so we need to manually trigger the onMomentumEnd
              // to make sure we snap
              if (isFinished) {
                onMomentumEnd(event);
              }
            })
          );
        }
      },
      onMomentumEnd,
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
