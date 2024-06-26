import { useCallback, useContext, type RefObject } from 'react';
import type { FlatList, ScrollView } from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated';
import { useCollapseHeaderOptionsContext } from '../contexts/CollapseHeaderOptionsContext';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import { getCloser } from '../tabViewUtils';

export default function useSyncScroll(
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  id: string,
  offsetCurrentScroll: SharedValue<number>,
  idTabView?: string
) {
  const { frozenTopOffset } = useCollapseHeaderOptionsContext(idTabView);
  const { activeScrollViewID, offsetActiveScrollView, heightHeader } =
    useContext(SyncedScrollableContext);

  const handleSyncScroll = useCallback(
    (
      offsetActiveScrollValue: number,
      offsetCurrentScrollValue: number,
      heightHeaderValue: number
    ) => {
      if (
        offsetCurrentScrollValue >= 0 &&
        offsetCurrentScrollValue <= heightHeaderValue - frozenTopOffset!
      ) {
        const closer = getCloser(
          offsetActiveScrollValue,
          heightHeaderValue - frozenTopOffset!,
          0
        );

        (innerScrollRef.current as ScrollView)?.scrollTo?.({
          animated: false,
          y: closer,
        });
        (innerScrollRef.current as FlatList)?.scrollToOffset?.({
          animated: false,
          offset: closer,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frozenTopOffset]
  );

  useAnimatedReaction(
    () => activeScrollViewID.value,
    (cur) => {
      if (cur === id) {
        runOnJS(handleSyncScroll)(
          offsetActiveScrollView.value,
          offsetCurrentScroll.value,
          heightHeader.value
        );
      }
    },
    [id]
  );
}
