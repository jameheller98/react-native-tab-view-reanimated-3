import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  type ForwardedRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, { makeMutable } from 'react-native-reanimated';
import { withCollapseHeaderComponent } from './HOCs/withCollapseHeaderComponent';
import { withSetHeightRoot } from './HOCs/withSetHeightRoot';
import Scene from './components/Scene';
import WrapperTabBar from './components/WrapperTabBar';
import { CollapseHeaderOptionsContext } from './contexts/CollapseHeaderOptionsContext';
import { SyncedScrollableState } from './contexts/SyncedScrollableState';
import useTabViewHook from './hooks/useTabViewHook';
import type {
  PagerViewInternal,
  RTabView,
  TTabBar,
  TTabView,
} from './tabView.types';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const ViewWithSetHeightRoot = withSetHeightRoot(View);

const WrapperTabBarWithCollapseHeader = withCollapseHeaderComponent(
  WrapperTabBar
) as <T>(
  props: TTabBar<T> & Pick<TTabView<T>, 'renderTabBar' | 'renderHeader'>
) => React.ReactElement<T>;

export const TabView = memo(
  forwardRef(
    <T,>(
      {
        routes,
        lazy = false,
        defaultIndexTab = 0,
        swipeEnabled = true,
        isSnap,
        revealHeaderOnScroll,
        minHeightHeader,
        styleHeaderContainer,
        renderTabBar,
        renderHeader,
        renderScene,
        onChangeTab,
      }: TTabView<T>,
      ref: ForwardedRef<RTabView>
    ) => {
      const syncedScrollableState = useMemo(
        () => ({
          activeScrollViewID: makeMutable(''),
          offsetActiveScrollView: makeMutable(0),
          heightHeader: makeMutable(0),
          heightTabBar: makeMutable(0),
          heightRoot: makeMutable(0),
        }),
        []
      );
      const paperViewRef = useRef<PagerViewInternal>(null);
      const {
        position,
        currentIndex,
        pageScrollState,
        handlePageScroll,
        handlePageScrollStateChanged,
        handlePageSelected,
      } = useTabViewHook<T>({
        defaultIndexTab,
        routes,
        activeScrollViewID: syncedScrollableState.activeScrollViewID,
        onChangeTab,
      });

      useImperativeHandle(ref, () => {
        return {
          setIndexTab: (indexTab: number) => {
            if (!paperViewRef.current) return;

            paperViewRef.current.setPage(indexTab);
          },
          setIsSwipe: (isSwipe: boolean) => {
            if (!paperViewRef.current) return;

            paperViewRef.current.setScrollEnabled(isSwipe);
          },
        };
      }, []);

      return (
        <SyncedScrollableState.Provider value={syncedScrollableState}>
          <CollapseHeaderOptionsContext.Provider
            value={{
              isSnap: isSnap || false,
              minHeightHeader: minHeightHeader || 0,
              revealHeaderOnScroll: revealHeaderOnScroll || false,
              styleHeaderContainer,
            }}
          >
            <ViewWithSetHeightRoot style={styles.container}>
              <WrapperTabBarWithCollapseHeader
                renderTabBar={renderTabBar}
                renderHeader={renderHeader}
                routes={routes}
                position={position}
                currentIndex={currentIndex}
                paperViewRef={paperViewRef}
                pageScrollState={pageScrollState}
              />

              <AnimatedPagerView
                //@ts-ignore
                ref={paperViewRef}
                scrollEnabled={swipeEnabled}
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
            </ViewWithSetHeightRoot>
          </CollapseHeaderOptionsContext.Provider>
        </SyncedScrollableState.Provider>
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
