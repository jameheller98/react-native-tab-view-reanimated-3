import React, { type ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import type { TCollapseHeader } from '../tabView.types';

const CollapseHeader = ({ children, renderHeader }: TCollapseHeader) => {
  return (
    <Animated.View>
      {renderHeader()}
      {children as ReactNode}
    </Animated.View>
  );
};

export default CollapseHeader;

// const styles = StyleSheet.create({});
