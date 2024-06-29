import { createContext } from 'react';
import { makeMutable } from 'react-native-reanimated';

export const SyncedScrollableState = createContext({
  activeScrollViewID: makeMutable(''),
  offsetActiveScrollView: makeMutable(0),
  heightHeader: makeMutable(0),
  heightTabBar: makeMutable(0),
  heightRoot: makeMutable(0),
});
