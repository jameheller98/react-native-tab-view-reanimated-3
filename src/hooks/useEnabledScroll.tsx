import { useAtomValue, type PrimitiveAtom } from 'jotai';
import { useCallback, type RefObject } from 'react';
import type { FlatList, ScrollView } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';
import type { TStateScrollable } from '../tabView.types';

export default function useEnabledScroll(
  innerScrollRef: RefObject<FlatList<any> | ScrollView>,
  id: string,
  syncScrollableAtom?: PrimitiveAtom<TStateScrollable>
) {
  const { activeScrollViewID } = useAtomValue(
    syncScrollableAtom || syncedScrollableAtomReadOnly
  );

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
