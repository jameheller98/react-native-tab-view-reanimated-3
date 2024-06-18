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
      if (
        offsetCurrentScroll.value <=
        offsetActiveScrollView.value - collapseHeaderOptions.frozenTopOffset!
      ) {
        offsetActiveScrollView.value = clamp(
          event.contentOffset.y,
          0,
          heightHeader.value
        );
      } else if (
        offsetCurrentScroll.value >
        offsetActiveScrollView.value - collapseHeaderOptions.frozenTopOffset!
      ) {
        offsetActiveScrollView.value = heightHeader.value;
      }

      offsetCurrentScroll.value = event.contentOffset.y;
    },
    [collapseHeaderOptions]
  );

  return scrollHandler;
}
