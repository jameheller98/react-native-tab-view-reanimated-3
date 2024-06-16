import { useContext } from 'react';
import {
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import { clamp } from '../tabViewUtils';

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>
) {
  const { offsetActiveScrollView, heightHeader } = useContext(
    SyncedScrollableContext
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetActiveScrollView.value = clamp(
      event.contentOffset.y,
      0,
      heightHeader.value
    );
    offsetCurrentScroll.value = event.contentOffset.y;
  });

  return scrollHandler;
}
