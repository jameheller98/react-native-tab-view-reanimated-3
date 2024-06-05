import React, { ComponentType, createElement, memo } from "react";
import { Route } from "../tabView.types";

const SceneComponent = memo(
  <T extends { component: ComponentType<any>; route: Route<any> }>({
    component,
    ...rest
  }: T) => {
    return component ? createElement(component, rest) : null;
  }
);

export function SceneMap<T extends any>(scenes: {
  [key: string]: React.ComponentType<T>;
}) {
  return ({ route }: { route: Route<any> }) => (
    <SceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
    />
  );
}
