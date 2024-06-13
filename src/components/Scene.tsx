import { memo, useState } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import type { TScene } from '../tabView.types';

function Scene<T>({
  renderScene,
  item,
  lazy,
  index,
  currentIndex,
  pageScrollState,
}: TScene<T>) {
  const [isRender, setIsRender] = useState(!lazy);

  useAnimatedReaction(
    () => ({
      currentIndex: currentIndex.value,
      pageScrollState: pageScrollState.value,
    }),
    (cur) => {
      if (lazy) {
        if (
          cur.currentIndex === index &&
          !isRender &&
          cur.pageScrollState === 'idle'
        ) {
          runOnJS(setIsRender)(true);
        }
      }
    },
    [lazy, index, isRender]
  );

  return isRender ? renderScene({ route: item }) : null;
}

export default memo(Scene) as typeof Scene;
