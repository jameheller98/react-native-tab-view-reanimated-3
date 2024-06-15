import { useCallback, useContext } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import type { TTabView } from '../tabView.types';
import { usePagerScrollHandler } from './usePagerScrollHandler';

export default function useTabViewHook<T>({
  defaultIndexTab,
  routes,
  onChangeTab,
}: {
  defaultIndexTab: number;
  routes: TTabView<T>['routes'];
  onChangeTab?: (currentIndexTab: number) => void;
}) {
  const { activeScrollViewID } = useContext(SyncedScrollableContext);
  const position = useSharedValue(defaultIndexTab);
  const currentIndex = useSharedValue(defaultIndexTab);
  const pageScrollState = useSharedValue<'idle' | 'dragging' | 'settling'>(
    'idle'
  );

  const handlePageScroll = usePagerScrollHandler({
    onPageScroll: (e: any) => {
      'worklet';
      position.value = e.offset + e.position;
    },
  });

  const handlePageScrollStateChanged = useCallback(
    (
      e: NativeSyntheticEvent<
        Readonly<{ pageScrollState: 'idle' | 'dragging' | 'settling' }>
      >
    ) => {
      pageScrollState.value = e.nativeEvent.pageScrollState;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePageSelected = useCallback(
    (
      e: NativeSyntheticEvent<
        Readonly<{
          position: number;
        }>
      >
    ): void | Promise<void> => {
      currentIndex.value = e.nativeEvent.position;
      activeScrollViewID.value = routes[e.nativeEvent.position]!.key;
      onChangeTab && onChangeTab(e.nativeEvent.position);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routes]
  );

  return {
    position,
    currentIndex,
    pageScrollState,
    handlePageScroll,
    handlePageScrollStateChanged,
    handlePageSelected,
  };
}
