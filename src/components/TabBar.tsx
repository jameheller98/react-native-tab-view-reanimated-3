import React, { memo, useCallback, useRef } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
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
  type AnimatedStyleProp,
} from 'react-native-reanimated';
import type { IRoute, TMeasure, TTabBar } from '../tabView.types';
import { getMeasure } from '../tabViewUtils';
import { TabBarItem } from './TabBarItem';

const { width: widthWindow } = Dimensions.get('window');
const HEIGHT_INDICATOR = 5;

export const TabBar = memo(
  <T,>({
    routes,
    position,
    currentIndex,
    paperViewRef,
    pageScrollState,
    hiddenIndicator = false,
    styleContainerList,
    renderTabBarItem,
    renderIndicator,
  }: TTabBar<T>) => {
    const refScrollView = useAnimatedRef<Animated.ScrollView>();
    const refsArray = useRef<Array<TouchableOpacity | null>>([]);
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
      const translateX = interpolate(position.value, input, [
        tabsMeasure.value[currentIndex.value - 1]?.pageX || 0,
        tabsMeasure.value[currentIndex.value]?.pageX || 0,
        tabsMeasure.value[currentIndex.value + 1]?.pageX || 0,
      ]);
      const scaleX = interpolate(position.value, input, [
        (tabsMeasure.value[currentIndex.value - 1]?.width || 0) / widthWindow,
        (tabsMeasure.value[currentIndex.value]?.width || 0) / widthWindow,
        (tabsMeasure.value[currentIndex.value + 1]?.width || 0) / widthWindow,
      ]);

      scrollTo(
        refScrollView,
        translateX -
          (widthWindow - (tabsMeasure.value[currentIndex.value]?.width || 0)) /
            2,
        0,
        true
      );

      return {
        transform: [
          {
            translateX: withSpring(translateX - widthWindow / 2, { mass: 0.6 }),
          },
          { scaleX: withSpring(scaleX, { mass: 0.6 }) },
          { translateX: widthWindow / 2 },
        ],
      } as AnimatedStyleProp<ViewStyle>;
    }, []);

    const handleLayout = useCallback(() => {
      const arrMeasure: TMeasure[] = [];

      refsArray.current = refsArray.current.filter((item) => Boolean(item));

      const getAllMeasure = () => {
        if (refsArray.current.length === routes.length) {
          getMeasure(refsArray, arrMeasure);

          if (arrMeasure.length > 1) {
            tabsMeasure.value = [...arrMeasure];
            arrMeasure.length = 0;
            return;
          } else if (arrMeasure.length === 1 && arrMeasure[0]) {
            tabsMeasure.value = [{ ...arrMeasure[0], pageX: 0 }];
            arrMeasure.length = 0;
            return;
          }
        }

        requestAnimationFrame(getAllMeasure);
      };

      getAllMeasure();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes.length]);

    const handleSetPage = useCallback((index: number) => {
      if (Platform.OS === 'ios') {
        requestAnimationFrame(() => paperViewRef.current?.setPage(index));
      } else {
        paperViewRef.current?.setPage(index);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeTab = useCallback((index: number) => {
      'worklet';
      if (pageScrollState.value === 'idle') {
        runOnJS(handleSetPage)(index);
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
              styleContainerList,
            ]}
          >
            {routes.map((item: IRoute<T>, index: number) => (
              <TouchableOpacity
                key={item.key}
                style={styles.item}
                activeOpacity={0.8}
                hitSlop={10}
                onPress={() => handleChangeTab(index)}
                ref={(ref) => {
                  refsArray.current[index] = ref;
                }}
                onLayout={
                  index === routes.length - 1 ? handleLayout : undefined
                }
              >
                {renderTabBarItem ? (
                  renderTabBarItem({ title: item.title, position, index })
                ) : (
                  <TabBarItem
                    title={item.title}
                    position={position}
                    index={index}
                  />
                )}
              </TouchableOpacity>
            ))}
            {!hiddenIndicator && (
              <Animated.View style={[styles.indicator, animatedIndicator]}>
                {renderIndicator ? (
                  renderIndicator()
                ) : (
                  <View style={styles.drawIndicator} />
                )}
              </Animated.View>
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
    flexGrow: 1,
  },
  containerHiddenIndicator: {
    paddingBottom: 0,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: widthWindow,
    height: HEIGHT_INDICATOR,
    position: 'absolute',
    bottom: 0,
  },
  drawIndicator: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
});
