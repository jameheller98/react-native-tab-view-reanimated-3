import { Provider } from 'jotai';
import type { ComponentType } from 'react';
import React from 'react';

export default function withProviderJotai(Component: ComponentType<any>) {
  return (props: any) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };
}
