import { useCallback } from "react";
import { NativeSyntheticEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function useTabViewHook({
  defaultIndexTab,
}: {
  defaultIndexTab: number;
}) {
  const position = useSharedValue(defaultIndexTab);
  const currentIndex = useSharedValue(defaultIndexTab);
  const isPageScrollState = useSharedValue<"idle" | "dragging" | "settling">(
    "idle"
  );

  const handlePageScroll = useCallback(
    (
      e: NativeSyntheticEvent<
        Readonly<{
          position: number;
          offset: number;
        }>
      >
    ): void | Promise<void> => {
      position.value = e.nativeEvent.offset + e.nativeEvent.position;
    },
    []
  );

  const handlePageScrollStateChanged = useCallback(
    (
      e: NativeSyntheticEvent<
        Readonly<{ pageScrollState: "idle" | "dragging" | "settling" }>
      >
    ) => {
      isPageScrollState.value = e.nativeEvent.pageScrollState;
    },
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
    },
    []
  );

  return {
    position,
    currentIndex,
    isPageScrollState,
    handlePageScroll,
    handlePageScrollStateChanged,
    handlePageSelected,
  };
}
