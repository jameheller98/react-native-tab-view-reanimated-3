import { ReactElement, memo, useState } from "react";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Route } from "../tabView.types";

const Scene = <T,>({
  renderScene,
  item,
  lazy,
  currentIndex,
  index,
}: {
  renderScene: ({ route }: { route: Route<T> }) => ReactElement<T>;
  item: Route<T>;
  lazy: boolean;
  currentIndex: SharedValue<number>;
  index: number;
}) => {
  const [isRender, setIsRender] = useState(!lazy);

  useAnimatedReaction(
    () => currentIndex.value,
    (cur) => {
      if (lazy) {
        if (cur === index && !isRender) {
          runOnJS(setIsRender)(true);
        }
      }
    },
    [lazy, index, isRender]
  );

  return isRender ? renderScene({ route: item }) : null;
};

export default memo(Scene);
