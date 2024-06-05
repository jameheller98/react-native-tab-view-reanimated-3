import { MutableRefObject, ReactElement } from "react";
import PagerView from "react-native-pager-view";
import { SharedValue } from "react-native-reanimated";

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
  paperViewRef: MutableRefObject<typeof PagerView>;
  isPageScrollState: SharedValue<"idle" | "dragging" | "settling">;
  hiddenIndicator?: boolean;
};
