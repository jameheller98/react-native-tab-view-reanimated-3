'use client';

import { atom } from 'jotai';
import { makeMutable, type SharedValue } from 'react-native-reanimated';

const syncedScrollableAtom = atom({
  activeScrollViewID: makeMutable(''),
  offsetActiveScrollView: makeMutable(0),
  heightHeader: makeMutable(0),
  heightTabBar: makeMutable(0),
  heightRoot: makeMutable(0),
});

export const syncedScrollableAtomReadOnly = atom<{
  activeScrollViewID: SharedValue<string>;
  offsetActiveScrollView: SharedValue<number>;
  heightHeader: SharedValue<number>;
  heightTabBar: SharedValue<number>;
  heightRoot: SharedValue<number>;
}>((get) => get(syncedScrollableAtom));
