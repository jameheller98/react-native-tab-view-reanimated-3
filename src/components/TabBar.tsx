import React, { memo, useCallback, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { TMeasure, TTabBar } from '../../../src/tabView.types';
import { getMeasure } from '../../../src/tabViewUtils';
import TabBarItem from './TabBarItem';

const { width: widthWindow } = Dimensions.get('window');
const HEIGHT_INDICATOR = 5;

const TabBar = <T,>({
  routes,
  position,
  currentIndex,
  paperViewRef,
  isPageScrollState,
  hiddenIndicator = false,
}: TTabBar<T>) => {
  const refScrollView = useAnimatedRef<Animated.ScrollView>();
  const refsArray = useRef<Array<Text | null>>([]);
  const tabsMeasure = useSharedValue<TMeasure[]>(
    routes.map(() => ({ x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 }))
  );

  useAnimatedReaction(
    () => routes.length,
    (cur, prev) => {
      if (prev !== null && position.value >= cur) {
        position.value = routes.length - 1;
      }
    },
    [routes.length]
  );

  const animatedIndicator = useAnimatedStyle(() => {
    const input = [
      currentIndex.value - 1,
      currentIndex.value,
      currentIndex.value + 1,
    ];
    const width = interpolate(position.value, input, [
      tabsMeasure.value[currentIndex.value - 1]?.width || 0,
      tabsMeasure.value[currentIndex.value]?.width || 0,
      tabsMeasure.value[currentIndex.value + 1]?.width || 0,
    ]);
    const translateX = interpolate(position.value, input, [
      tabsMeasure.value[currentIndex.value - 1]?.pageX || 0,
      tabsMeasure.value[currentIndex.value]?.pageX || 0,
      tabsMeasure.value[currentIndex.value + 1]?.pageX || 0,
    ]);

    scrollTo(refScrollView, translateX - (widthWindow - width) / 2, 0, true);

    return {
      width: withSpring(width),
      transform: [{ translateX: withSpring(translateX) }],
    };
  }, []);

  const handleLayout = useCallback(() => {
    const arrMeasure: TMeasure[] = [];

    refsArray.current = refsArray.current.filter((item) => Boolean(item));

    const getAllMeasure = () => {
      if (refsArray.current.length === routes.length) {
        getMeasure(refsArray, arrMeasure);

        if (arrMeasure.length > 0) {
          tabsMeasure.value = [...arrMeasure];

          arrMeasure.length = 0;
          return;
        }
      }

      requestAnimationFrame(getAllMeasure);
    };

    getAllMeasure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.length]);

  const handleChangeTab = useCallback((index: number) => {
    'worklet';
    if (isPageScrollState.value === 'idle') {
      runOnJS(paperViewRef.current?.setPage || ((_) => {}))(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      {routes.length > 0 && (
        <Animated.ScrollView
          ref={refScrollView}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={[
            styles.containerIndicator,
            hiddenIndicator && styles.containerHiddenIndicator,
          ]}
          onContentSizeChange={handleLayout}
        >
          {routes.map((item, index) => (
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.8}
              hitSlop={10}
              key={item.key}
              onPress={() => handleChangeTab(index)}
              ref={(ref) => {
                refsArray.current[index] = ref;
              }}
            >
              <TabBarItem
                title={item.title}
                position={position}
                index={index}
              />
            </TouchableOpacity>
          ))}
          {!hiddenIndicator && (
            <Animated.View style={[styles.indicator, animatedIndicator]} />
          )}
        </Animated.ScrollView>
      )}
    </View>
  );
};

export default memo(TabBar);

const styles = StyleSheet.create({
  containerIndicator: {
    paddingBottom: HEIGHT_INDICATOR,
  },
  containerHiddenIndicator: {
    paddingBottom: 0,
  },
  item: {
    height: 30,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    height: HEIGHT_INDICATOR,
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 0,
  },
});
