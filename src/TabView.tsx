import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import Scene from "./components/Scene";
import TabBar from "./components/TabBar";
import useTabViewHook from "./hooks/useTabViewHook";
import { RTabView, TTabView } from "./tabView.types";

const TabView = forwardRef(
  <T,>(
    { routes, renderScene, lazy = false, defaultIndexTab = 0 }: TTabView<T>,
    ref: ForwardedRef<RTabView>
  ) => {
    const paperViewRef = useRef<typeof PagerView>(null);
    const {
      position,
      currentIndex,
      isPageScrollState,
      handlePageScroll,
      handlePageScrollStateChanged,
      handlePageSelected,
    } = useTabViewHook({ defaultIndexTab });

    useImperativeHandle(
      ref,
      () => {
        return {
          setIndexTab: (indexTab) => {
            if (!paperViewRef.current) return;

            paperViewRef.current.setPage(indexTab);
          },
        };
      },
      []
    );

    return (
      <View style={styles.container}>
        <TabBar
          routes={routes}
          position={position}
          currentIndex={currentIndex}
          paperViewRef={paperViewRef}
          isPageScrollState={isPageScrollState}
        />
        <PagerView
          ref={paperViewRef}
          style={styles.pagerView}
          initialPage={defaultIndexTab}
          offscreenPageLimit={1}
          onPageScroll={handlePageScroll}
          onPageSelected={handlePageSelected}
          onPageScrollStateChanged={handlePageScrollStateChanged}
        >
          {routes.map((item, index) => (
            <View key={item.key}>
              <Scene
                renderScene={renderScene}
                item={item}
                lazy={lazy}
                currentIndex={currentIndex}
                index={index}
              />
            </View>
          ))}
        </PagerView>
      </View>
    );
  }
);

export default memo(TabView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
});
