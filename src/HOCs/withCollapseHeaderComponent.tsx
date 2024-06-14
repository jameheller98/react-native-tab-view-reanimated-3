import type { ComponentType } from 'react';
import React from 'react';
import CollapseHeader from '../components/CollapseHeader';
import type { TCollapseHeader } from '../tabView.types';

export function withCollapseHeaderComponent<T extends Object>(
  Component: ComponentType<T>
) {
  return (props: T & Partial<Pick<TCollapseHeader, 'renderHeader'>>) => {
    const { renderHeader, ...rest } = props;

    return renderHeader ? (
      <CollapseHeader renderHeader={renderHeader}>
        <Component {...(rest as T)} />
      </CollapseHeader>
    ) : (
      <Component {...(rest as T)} />
    );
  };
}
