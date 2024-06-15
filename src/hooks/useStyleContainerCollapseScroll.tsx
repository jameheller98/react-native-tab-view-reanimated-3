import { useContext, useMemo, useState } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';

export default function useStyleContainerCollapseScroll(
  contentContainerStyle: StyleProp<ViewStyle>
) {
  const [height, setHeight] = useState(0);
  const { heightHeader, heightTabBar } = useContext(SyncedScrollableContext);
  const contentContainerFlatten = StyleSheet.flatten(contentContainerStyle);

  useAnimatedReaction(
    () => heightHeader.value + heightTabBar.value,
    (cur) => {
      runOnJS(setHeight)(cur);
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
            ? height + (contentContainerFlatten?.paddingTop || 0)
            : contentContainerFlatten.paddingTop,
      },
    ],
    [height, contentContainerStyle, contentContainerFlatten?.paddingTop]
  );

  return styleContainerComponent;
}
