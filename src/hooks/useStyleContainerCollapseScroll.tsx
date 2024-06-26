import { useContext, useMemo, useState } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { SyncedScrollableState } from '../contexts/SyncedScrollableState';
import type { THeightControl } from '../tabView.types';

export default function useStyleContainerCollapseScroll(
  contentContainerStyle: StyleProp<ViewStyle>
) {
  const [heightControl, setHeightControl] = useState<THeightControl>({
    heightHeader: 0,
    heightRoot: 0,
    heightTabBar: 0,
  });
  const { heightHeader, heightTabBar, heightRoot } = useContext(
    SyncedScrollableState
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
