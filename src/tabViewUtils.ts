import { MutableRefObject } from "react"
import { Text } from "react-native"
import { TMeasure } from "./tabView.types"

export const getMeasure = (refs: MutableRefObject<Text[]>, refsMeasure: TMeasure[]) => {
  refs.current.forEach((item) => {
    item.measure((x, y, width, height, pageX, pageY) => {
      refsMeasure.push({ x, y, width, height, pageX, pageY })
    })
  })
}

export const getCloser = (value, min, max) => {
  "worklet"

  return Math.abs(value - min) < Math.abs(value - max) ? min : max
}
