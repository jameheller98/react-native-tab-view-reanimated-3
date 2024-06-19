import type { Component, MutableRefObject, ReactElement } from 'react';
import type { HostComponent, StyleProp, ViewStyle } from 'react-native';
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

export interface IRoute<T> {
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
  routes: IRoute<T>[];
  lazy?: boolean;
  defaultIndexTab?: number;
  scrollEnabled?: boolean;
  renderTabBar?: (props: TTabBar<T>) => ReactElement;
  renderScene: ({ route }: { route: IRoute<T> }) => ReactElement;
  onChangeTab?: (currentIndexTab: number) => void;
} & Partial<Pick<TCollapseHeader, 'renderHeader'>> &
  TTabViewContext;

export type RTabView = {
  setIndexTab: (indexTab: number) => void;
  setIsSwipe: (isSwipe: boolean) => void;
  clean: () => void;
};

export type TTabBar<T> = {
  routes: IRoute<T>[];
  position: SharedValue<number>;
  currentIndex: SharedValue<number>;
  readonly paperViewRef: MutableRefObject<PagerViewInternal | null>;
  pageScrollState: SharedValue<'idle' | 'dragging' | 'settling'>;
  hiddenIndicator?: boolean;
  styleContainerList?: StyleProp<ViewStyle>;
  styleTabBarItem?: StyleProp<ViewStyle>;
  renderTabBarItem?: (props: TTabBarItem) => ReactElement;
  renderIndicator?: () => ReactElement;
};

export type TTabBarItem = {
  title: string;
  position: SharedValue<number>;
  index: number;
};

export type TScene<T> = {
  item: IRoute<T>;
  lazy: boolean;
  currentIndex: SharedValue<number>;
  index: number;
  pageScrollState: SharedValue<'idle' | 'dragging' | 'settling'>;
  renderScene: ({ route }: { route: IRoute<T> }) => ReactElement;
};

export type TCollapseHeader = {
  children: Element;
  renderHeader: ({
    offsetActiveScrollView,
  }: {
    offsetActiveScrollView: SharedValue<number>;
  }) => ReactElement;
};

export type THeightControl = {
  heightHeader: number;
  heightTabBar: number;
  heightRoot: number;
};

export type TTabViewContext = {
  collapseHeaderOptions: {
    frozenTopOffset?: number;
    styleHeaderContainer?: StyleProp<ViewStyle>;
    isStickHeaderOnTop?: boolean;
  };
};
