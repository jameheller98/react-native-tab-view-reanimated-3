import React, { memo } from 'react';
import type { TTabBar, TTabView } from '../tabView.types';
import { TabBar } from './TabBar';

const WrapperTabBar = <T,>(
  props: TTabBar<T> & Pick<TTabView<T>, 'renderTabBar'>
) => {
  const { renderTabBar, ...rest } = props;

  return <>{renderTabBar ? renderTabBar(rest) : <TabBar {...rest} />}</>;
};

export default memo(WrapperTabBar) as typeof WrapperTabBar;
