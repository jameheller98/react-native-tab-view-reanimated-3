import React, { memo } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { TTabBarItem } from '../tabView.types';

export const TabBarItem = memo(({ title, position, index }: TTabBarItem) => {
  const styleAnimatedText = useAnimatedStyle(() => {
    return {
      fontWeight: Math.round(position.value) === index ? '700' : '400',
    };
  }, []);

  return <Animated.Text style={styleAnimatedText}>{title}</Animated.Text>;
});
