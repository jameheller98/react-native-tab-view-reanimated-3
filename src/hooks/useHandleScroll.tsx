import { useContext } from 'react';
import {
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';
import { useContextTabView } from '../contexts/TabViewContext';
import { clamp } from '../tabViewUtils';

export default function useHandleScroll(
  offsetCurrentScroll: SharedValue<number>
) {
  const { collapseHeaderOptions } = useContextTabView();
  const { offsetActiveScrollView, heightHeader } = useContext(
    SyncedScrollableContext
  );

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      if (offsetCurrentScroll.value <= offsetActiveScrollView.value) {
        offsetActiveScrollView.value = clamp(
          event.contentOffset.y,
          0,
          heightHeader.value - collapseHeaderOptions.frozenTopOffset!
        );
      }

      offsetCurrentScroll.value = event.contentOffset.y;
    },
    [collapseHeaderOptions.frozenTopOffset]
  );

  return scrollHandler;
}
