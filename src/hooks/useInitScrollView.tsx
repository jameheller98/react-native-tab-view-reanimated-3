import { useAtomValue } from 'jotai';
import { useCallback, type RefObject } from 'react';
import type { FlatList, ScrollView } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';

export default function useInitScroll(
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  id: string
) {
  const { activeScrollViewID, offsetActiveScrollView } = useAtomValue(
    syncedScrollableAtomReadOnly
  );

  const handleScroll = useCallback(
    (offsetActiveScrollViewValue: number) => {
      (innerScrollRef.current as ScrollView)?.scrollTo?.({
        animated: false,
        y: offsetActiveScrollViewValue,
      });
      (innerScrollRef.current as FlatList)?.scrollToOffset?.({
        animated: false,
        offset: offsetActiveScrollViewValue,
      });
    },
    [innerScrollRef]
  );

  const handleInit = useCallback(() => {
    'worklet';
    if (activeScrollViewID.value === id) {
      runOnJS(handleScroll)(offsetActiveScrollView.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleScroll]);

  return handleInit;
}
