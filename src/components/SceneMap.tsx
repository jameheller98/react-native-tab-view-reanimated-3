import React, { createElement, memo, type ComponentType } from 'react';
import type { IRoute } from '../tabView.types';

const SceneComponent = memo(
  <T extends { component: ComponentType<any>; route: IRoute<T> }>({
    component,
    ...rest
  }: T) => {
    return component ? createElement(component, rest) : null;
  }
);

export function SceneMap<T extends any>(scenes: {
  [key: string]: React.ComponentType<T>;
}) {
  return ({ route }: { route: IRoute<T> }) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key] as ComponentType<any>}
      route={route}
    />
  );
}
