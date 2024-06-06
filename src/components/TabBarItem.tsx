import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

const TabBarItem = ({
  title,
  position,
  index,
}: {
  title: string;
  position: SharedValue<number>;
  index: number;
}) => {
  const styleAnimatedText = useAnimatedStyle(() => {
    return {
      fontWeight: Math.round(position.value) === index ? '700' : '400',
    };
  }, []);

  return (
    <Animated.Text style={[styles.text, styleAnimatedText]}>
      {title}
    </Animated.Text>
  );
};

export default memo(TabBarItem);

const styles = StyleSheet.create({
  text: {},
});
