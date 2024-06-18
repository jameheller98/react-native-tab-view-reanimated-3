import type { ComponentType } from 'react';
import React from 'react';
import CollapseHeader from '../components/CollapseHeader';
import type { TCollapseHeader } from '../tabView.types';

export function withCollapseHeaderComponent<T extends Object>(
  Component: ComponentType<T>
) {
  return (
    props: T &
      Partial<Pick<TCollapseHeader, 'renderHeader' | 'collapseHeaderOptions'>>
  ) => {
    const { renderHeader, collapseHeaderOptions, ...rest } = props;
    const defaultCollapseHeaderOptions = Object.assign(
      { frozenTopOffset: 0 } as NonNullable<
        TCollapseHeader['collapseHeaderOptions']
      >,
      collapseHeaderOptions
    );

    return renderHeader ? (
      <CollapseHeader
        renderHeader={renderHeader}
        collapseHeaderOptions={defaultCollapseHeaderOptions}
      >
        <Component {...(rest as T)} />
      </CollapseHeader>
    ) : (
      <Component {...(rest as T)} />
    );
  };
}
