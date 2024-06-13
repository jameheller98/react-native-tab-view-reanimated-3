import { useCallback } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { usePagerScrollHandler } from './usePagerScrollHandler';

export default function useTabViewHook({
  defaultIndexTab,
  onChangeTab,
}: {
  defaultIndexTab: number;
  onChangeTab?: (currentIndexTab: number) => void;
}) {
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
      onChangeTab && onChangeTab(e.nativeEvent.position);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
