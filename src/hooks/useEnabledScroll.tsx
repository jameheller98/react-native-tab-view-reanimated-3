import { useAtomValue } from 'jotai';
import { useCallback, type RefObject } from 'react';
import type { FlatList, ScrollView } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';

export default function useEnabledScroll(
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  id: string
) {
  const { activeScrollViewID } = useAtomValue(syncedScrollableAtomReadOnly);

  const handleEnabledScroll = useCallback((isScroll: boolean) => {
    innerScrollRef.current?.setNativeProps({ scrollEnabled: isScroll });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAnimatedReaction(
    () => activeScrollViewID.value,
    (cur) => {
      if (cur === id) {
        runOnJS(handleEnabledScroll)(true);
      } else if (cur !== '') {
        runOnJS(handleEnabledScroll)(false);
      }
    },
    [id]
  );
}
