import { useContext } from 'react';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';

export default function useHandleScroll() {
  const { offsetActiveScrollView } = useContext(SyncedScrollableContext);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetActiveScrollView.value = event.contentOffset.y;
  });

  return scrollHandler;
}
