import { Provider } from 'jotai';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';
import { withCollapseHeaderComponent } from './HOCs/withCollapseHeaderComponent';
import { withSetHeightRoot } from './HOCs/withSetHeightRoot';
import Scene from './components/Scene';
import WrapperTabBar from './components/WrapperTabBar';
import { CollapseHeaderOptionsContextProvider } from './contexts/CollapseHeaderOptionsContext';
import useTabViewHook from './hooks/useTabViewHook';
import type {
  PagerViewInternal,
  RTabView,
  TCollapseHeaderOptions,
  TTabBar,
  TTabView,
} from './tabView.types';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const ViewWithSetHeightRoot = withSetHeightRoot(View);

const WrapperTabBarWithCollapseHeader = withCollapseHeaderComponent(
  WrapperTabBar
) as <T>(
  props: TTabBar<T> &
    Pick<
      TTabView<T>,
      'renderTabBar' | 'renderHeader' | 'syncScrollableAtom'
    > & {
      isCollapseHeader?: boolean;
      collapseHeaderOptions: TCollapseHeaderOptions;
    }
) => React.ReactElement<T>;

export const TabView = memo(
  forwardRef(
    <T,>(
      {
        routes,
        lazy = false,
        defaultIndexTab = 0,
        scrollEnabled = true,
        collapseHeaderOptions,
        idTabView,
        syncScrollableAtom,
        renderTabBar,
        renderHeader,
        renderScene,
        onChangeTab,
      }: TTabView<T>,
      ref: ForwardedRef<RTabView>
    ) => {
      const paperViewRef = useRef<PagerViewInternal>(null);
      const timeoutReset = useRef<NodeJS.Timeout>();
      const [isReset, setIsReset] = useState(false);
      const collapseHeaderOptionsState = useMemo(() => {
        const defaultCollapseHeaderOptions = Object.assign(
          {
            frozenTopOffset: 0,
            isStickHeaderOnTop: true,
            isCollapseHeader: false,
          } as TCollapseHeaderOptions,
          collapseHeaderOptions
        );

        return defaultCollapseHeaderOptions;
      }, [collapseHeaderOptions]);
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
        collapseHeaderOptions: collapseHeaderOptionsState,
        syncScrollableAtom,
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
          clean: () => {
            position.value = 0;
            currentIndex.value = 0;
          },
          reset: () => {
            clearTimeout(timeoutReset.current);
            setIsReset(true);
            timeoutReset.current = setTimeout(() => {
              setIsReset(false);
            }, 0);
          },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        !isReset && (
          <Provider>
            <ViewWithSetHeightRoot
              style={styles.container}
              syncScrollableAtom={syncScrollableAtom}
              collapseHeaderOptions={collapseHeaderOptionsState}
            >
              <WrapperTabBarWithCollapseHeader
                renderTabBar={renderTabBar}
                renderHeader={renderHeader}
                routes={routes}
                position={position}
                currentIndex={currentIndex}
                paperViewRef={paperViewRef}
                pageScrollState={pageScrollState}
                collapseHeaderOptions={collapseHeaderOptionsState}
                syncScrollableAtom={syncScrollableAtom}
              />
              <CollapseHeaderOptionsContextProvider
                collapseHeaderOptions={collapseHeaderOptionsState}
                idTabView={idTabView}
              >
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
                    <View
                      key={item.key}
                      style={styles.item}
                      collapsable={false}
                    >
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
              </CollapseHeaderOptionsContextProvider>
            </ViewWithSetHeightRoot>
          </Provider>
        )
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
