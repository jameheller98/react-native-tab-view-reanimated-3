import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';
import Scene from './components/Scene';
import { TabBar } from './components/TabBar';
import useTabViewHook from './hooks/useTabViewHook';
import type { PagerViewInternal, RTabView, TTabView } from './tabView.types';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const TabView = memo(
  forwardRef(
    <T,>(
      {
        routes,
        lazy = false,
        defaultIndexTab = 0,
        scrollEnabled = true,
        renderTabBar,
        renderScene,
        onChangeTab,
      }: TTabView<T>,
      ref: ForwardedRef<RTabView>
    ) => {
      const paperViewRef = useRef<PagerViewInternal>(null);
      const {
        position,
        currentIndex,
        pageScrollState,
        handlePageScroll,
        handlePageScrollStateChanged,
        handlePageSelected,
      } = useTabViewHook({ defaultIndexTab, onChangeTab });

      useImperativeHandle(ref, () => {
        return {
          setIndexTab: (indexTab: number) => {
            if (!paperViewRef.current) return;

            paperViewRef.current.setPage(indexTab);
          },
        };
      }, []);

      return (
        <View style={styles.container}>
          {renderTabBar ? (
            renderTabBar({
              routes,
              position,
              currentIndex,
              paperViewRef,
              pageScrollState,
            })
          ) : (
            <TabBar
              routes={routes}
              position={position}
              currentIndex={currentIndex}
              paperViewRef={paperViewRef}
              pageScrollState={pageScrollState}
            />
          )}
          <AnimatedPagerView
            //@ts-ignore
            ref={paperViewRef}
            scrollEnabled={scrollEnabled}
            style={styles.pagerView}
            initialPage={defaultIndexTab}
            offscreenPageLimit={1}
            onPageScroll={handlePageScroll}
            onPageSelected={handlePageSelected}
            onPageScrollStateChanged={handlePageScrollStateChanged}
          >
            {routes.map((item, index) => (
              <View key={item.key} style={styles.item} collapsable={false}>
                <Scene<T>
                  item={item}
                  lazy={lazy}
                  index={index}
                  currentIndex={currentIndex}
                  pageScrollState={pageScrollState}
                  renderScene={renderScene}
                />
              </View>
            ))}
          </AnimatedPagerView>
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
});
