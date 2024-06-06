import type { Component, MutableRefObject, ReactElement } from 'react';
import type { HostComponent } from 'react-native';
import type { NativeProps } from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent/PagerViewNativeComponent';
import type { SharedValue } from 'react-native-reanimated';

declare const PagerViewNativeComponent: HostComponent<NativeProps>;

export declare class PagerViewInternal extends Component<NativeProps> {
  private isScrolling: true;
  pagerView: React.ElementRef<typeof PagerViewNativeComponent> | null;
  private get nativeCommandsWrapper();
  private get deducedLayoutDirection();
  private _onPageScroll;
  private _onPageScrollStateChanged;
  private _onPageSelected;
  private _onMoveShouldSetResponderCapture;
  /**
   * A helper function to scroll to a specific page in the PagerView.
   * The transition between pages will be animated.
   */
  setPage: (selectedPage: number) => void;
  /**
   * A helper function to scroll to a specific page in the PagerView.
   * The transition between pages will *not* be animated.
   */
  setPageWithoutAnimation: (selectedPage: number) => void;
  /**
   * A helper function to enable/disable scroll imperatively
   * The recommended way is using the scrollEnabled prop, however, there might be a case where a
   * imperative solution is more useful (e.g. for not blocking an animation)
   */
  setScrollEnabled: (scrollEnabled: boolean) => void;
  render(): JSX.Element;
}

export interface Route<T> {
  key: string;
  title: string;
  data: T;
}

export type TMeasure = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export type TTabView<T> = {
  routes: Route<T>[];
  renderScene: ({ route }: { route: Route<T> }) => ReactElement<T>;
  lazy?: boolean;
  defaultIndexTab?: number;
};

export type RTabView = {
  setIndexTab: (indexTab: number) => void;
};

export type TTabBar<T> = {
  routes: Route<T>[];
  position: SharedValue<number>;
  currentIndex: SharedValue<number>;
  paperViewRef: MutableRefObject<PagerViewInternal | null>;
  isPageScrollState: SharedValue<'idle' | 'dragging' | 'settling'>;
  hiddenIndicator?: boolean;
};
