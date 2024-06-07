import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type ReactElement,
} from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';
import Scene from './components/Scene';
import { TabBar } from './components/TabBar';
import useTabViewHook from './hooks/useTabViewHook';
import type {
  PagerViewInternal,
  RTabView,
  Route,
  TTabView,
} from './tabView.types';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const TabView = memo(
  forwardRef(
    <T,>(
      {
        routes,
        renderTabBar,
        renderScene,
        lazy = false,
        defaultIndexTab = 0,
      }: TTabView<T>,
      ref: ForwardedRef<RTabView>
    ) => {
      const paperViewRef = useRef<PagerViewInternal>(null);
      const {
        position,
        currentIndex,
        isPageScrollState,
        handlePageScroll,
        handlePageScrollStateChanged,
        handlePageSelected,
      } = useTabViewHook({ defaultIndexTab });

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
              isPageScrollState,
            })
          ) : (
            <TabBar
              routes={routes}
              position={position}
              currentIndex={currentIndex}
              paperViewRef={paperViewRef}
              isPageScrollState={isPageScrollState}
            />
          )}
          <AnimatedPagerView
            //@ts-ignore
            ref={paperViewRef}
            style={styles.pagerView}
            initialPage={defaultIndexTab}
            offscreenPageLimit={1}
            onPageScroll={handlePageScroll}
            onPageSelected={handlePageSelected}
            onPageScrollStateChanged={handlePageScrollStateChanged}
          >
            {routes.map((item, index) => (
              <View key={item.key} style={styles.item}>
                <Scene
                  renderScene={
                    renderScene as ({
                      route,
                    }: {
                      route: Route<any>;
                    }) => ReactElement<T>
                  }
                  item={item}
                  lazy={lazy}
                  currentIndex={currentIndex}
                  index={index}
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
