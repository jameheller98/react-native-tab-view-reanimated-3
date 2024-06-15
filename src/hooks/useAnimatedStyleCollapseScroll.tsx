import { useContext } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { SyncedScrollableContext } from '../contexts/SyncedScrollableContext';

export default function useAnimatedStyleCollapseScroll(
  contentContainerStyle: StyleProp<ViewStyle>
) {
  const { heightHeader, heightTabBar } = useContext(SyncedScrollableContext);
  const contentContainerFlatten = StyleSheet.flatten(contentContainerStyle);

  const animatedStyleComponent = useAnimatedStyle(() => {
    return {
      paddingTop:
        typeof contentContainerFlatten?.paddingTop === 'number' ||
        contentContainerFlatten?.paddingTop === undefined
          ? heightHeader.value +
            heightTabBar.value +
            (contentContainerFlatten?.paddingTop || 0)
          : contentContainerFlatten.paddingTop,
    };
  }, []);

  return animatedStyleComponent;
}
