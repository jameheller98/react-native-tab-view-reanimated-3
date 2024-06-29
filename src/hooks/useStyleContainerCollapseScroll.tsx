import { useAtomValue, type PrimitiveAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { syncedScrollableAtomReadOnly } from '../atoms/syncedScrollableAtom';
import type { THeightControl, TStateScrollable } from '../tabView.types';

export default function useStyleContainerCollapseScroll(
  contentContainerStyle: StyleProp<ViewStyle>,
  syncScrollableAtom?: PrimitiveAtom<TStateScrollable>
) {
  const [heightControl, setHeightControl] = useState<THeightControl>({
    heightHeader: 0,
    heightRoot: 0,
    heightTabBar: 0,
  });
  const { heightHeader, heightTabBar, heightRoot } = useAtomValue(
    syncScrollableAtom || syncedScrollableAtomReadOnly
  );
  const contentContainerFlatten = StyleSheet.flatten(contentContainerStyle);

  useAnimatedReaction(
    () => ({
      heightHeader: heightHeader.value,
      heightTabBar: heightTabBar.value,
      heightRoot: heightRoot.value,
    }),
    (cur) => {
      runOnJS(setHeightControl)(cur);
    },
    []
  );

  const styleContainerComponent = useMemo(
    () => [
      contentContainerStyle,
      {
        paddingTop:
          typeof contentContainerFlatten?.paddingTop === 'number' ||
          contentContainerFlatten?.paddingTop === undefined
            ? heightControl.heightHeader +
              heightControl.heightTabBar +
              (contentContainerFlatten?.paddingTop || 0)
            : contentContainerFlatten.paddingTop,
        minHeight:
          typeof contentContainerFlatten?.minHeight === 'number' ||
          contentContainerFlatten?.minHeight === undefined
            ? heightControl.heightHeader + heightControl.heightRoot
            : contentContainerFlatten.minHeight,
      },
    ],
    [
      heightControl,
      contentContainerStyle,
      contentContainerFlatten?.paddingTop,
      contentContainerFlatten?.minHeight,
    ]
  );

  return styleContainerComponent;
}
