import type { MutableRefObject } from 'react';
import { Text } from 'react-native';
import type { TMeasure } from './tabView.types';

export const getMeasure = (
  refs: MutableRefObject<Array<Text | null>>,
  refsMeasure: TMeasure[]
) => {
  refs.current.forEach((item) => {
    item?.measure((x, y, width, height, pageX, pageY) => {
      refsMeasure.push({ x, y, width, height, pageX, pageY });
    });
  });
};
