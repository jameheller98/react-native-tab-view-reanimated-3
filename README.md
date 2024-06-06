# react-native-tab-view-reanimated-3

A package create tab view in react native

## Installation

```sh
npm install react-native-tab-view-reanimated-3
```

## Usage

```js
import { TabView, SceneMap, RTabView, Route } from "react-native-tab-view-reanimated-3";

const Tab1 = () => (
  <View style={{ flex: 1, borderWidth: 2, borderColor: 'red' }}>
  </View>
)
const Tab2 = () => <View style={{ flex: 1, borderWidth: 2, borderColor: 'blue' }}></View>

const scenes = SceneMap({
  "1": Tab1,
  "2": Tab2,
})

// ...

export const Test:FC<any> = () => {
  const refTabView = useRef<RTabView>(null)
  const [routes] = useState<Route<number>[]>([
    { key: "1", title: "Tab 1", data: 0 },
    { key: "2", title: "Tab 2 2", data: 1 },
  ])

  return (
    <View style={{flex: 1}}>
      <TabView ref={refTabView} routes={routes} renderScene={scenes} lazy />
    </View>
  )
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
