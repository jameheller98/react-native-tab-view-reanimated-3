import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { TTabBarItem } from '../tabView.types';

const TabBarItem = ({
  title,
  position,
  index,
  handlePressItem,
  refsArray,
}: TTabBarItem) => {
  const styleAnimatedText = useAnimatedStyle(() => {
    return {
      fontWeight: Math.round(position.value) === index ? '700' : '400',
    };
  }, []);

  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
      hitSlop={10}
      onPress={() => handlePressItem(index)}
      ref={(ref) => {
        refsArray.current[index] = ref;
      }}
    >
      <Animated.Text style={styleAnimatedText}>{title}</Animated.Text>
    </TouchableOpacity>
  );
};

export default memo(TabBarItem);

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
