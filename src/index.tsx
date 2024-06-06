import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-tab-view-reanimated-3' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type TabViewReanimated3Props = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'TabViewReanimated3View';

export const TabViewReanimated3View =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<TabViewReanimated3Props>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
