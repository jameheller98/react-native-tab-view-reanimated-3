import React, { memo, useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
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
import type { Route, TMeasure, TTabBar } from '../tabView.types';
import { getMeasure } from '../tabViewUtils';
import TabBarItem from './TabBarItem';

const { width: widthWindow } = Dimensions.get('window');
const HEIGHT_INDICATOR = 5;

export const TabBar = memo(
  <T,>({
    routes,
    position,
    currentIndex,
    paperViewRef,
    isPageScrollState,
    hiddenIndicator = false,
    renderTabBarItem,
  }: TTabBar<T>) => {
    const refScrollView = useAnimatedRef<Animated.ScrollView>();
    const refsArray = useRef<Array<Text | null>>([]);
    const tabsMeasure = useSharedValue<TMeasure[]>(
      routes.map(() => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        pageX: 0,
        pageY: 0,
      }))
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
            {routes.map((item: Route<T>, index: number) =>
              renderTabBarItem ? (
                renderTabBarItem({
                  index,
                  position,
                  refsArray,
                  title: item.title,
                  handlePressItem: handleChangeTab,
                })
              ) : (
                <TabBarItem
                  key={item.key}
                  title={item.title}
                  position={position}
                  index={index}
                  refsArray={refsArray}
                  handlePressItem={handleChangeTab}
                />
              )
            )}
            {!hiddenIndicator && (
              <Animated.View style={[styles.indicator, animatedIndicator]} />
            )}
          </Animated.ScrollView>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  containerIndicator: {
    paddingBottom: HEIGHT_INDICATOR,
  },
  containerHiddenIndicator: {
    paddingBottom: 0,
  },
  item: {
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
