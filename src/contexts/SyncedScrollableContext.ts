import { createContext } from 'react';
import { makeMutable, type SharedValue } from 'react-native-reanimated';

export const syncedScrollableState: {
  activeScrollViewID: SharedValue<string>;
  offsetActiveScrollView: SharedValue<number>;
} = {
  activeScrollViewID: makeMutable(''),
  offsetActiveScrollView: makeMutable(0),
};

export const SyncedScrollableContext = createContext(syncedScrollableState);
