# react-native-tab-view-reanimated-3

A package create tab view in react native, using react-native-pager-view on Android & iOS and reanimated 3 for animation, support collapse tab view header, basic using below.

## Installation

```sh
npm install react-native-tab-view-reanimated-3 react-native-pager-view
```

or

```sh
yarn add react-native-tab-view-reanimated-3 react-native-pager-view
```

Then sure Reanimated is installed by [follow the official installation guide.](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)

## Quick start

```js
import { TabView, SceneMap, RTabView, IRoute } from "react-native-tab-view-reanimated-3";

type TRouteData = number

const Tab1 = ({route} : {route:IRoute<TRouteData>}) => <View style={{ flex: 1, backgroundColor: 'gray' }}></View>
const Tab2 = ({route} : {route:IRoute<TRouteData>}) => <View style={{ flex: 1, backgroundColor: 'purple' }}></View>

const scenes = SceneMap({
  "1": Tab1,
  "2": Tab2,
})

// ...

export const Test:FC<any> = () => {
  const refTabView = useRef<RTabView>(null)
  const [routes] = useState<IRoute<TRouteData>[]>([
    { key: "1", title: "Tab 1", data: 0 },
    { key: "2", title: "Tab 2", data: 1 },
  ])

  return (
    <View style={{flex: 1}}>
      <TabView ref={refTabView} routes={routes} renderScene={scenes} lazy />
    </View>
  )
}
```

## Quick start with collapse header

```js
import { TabView, SceneMap, RTabView, IRoute, ScrollViewWithCollapse } from "react-native-tab-view-reanimated-3";

type TRouteData = number

// NOTE: you must pass route to tab and use route key for ScrollViewWithCollapse to sync scroll
const Tab1 = ({route} : {route:IRoute<TRouteData>}) => <ScrollViewWithCollapse key={route.key} style={{ flex: 1, backgroundColor: 'gray' }}></ScrollViewWithCollapse>
const Tab2 = ({route} : {route:IRoute<TRouteData>}) => <ScrollViewWithCollapse key={route.key} style={{ flex: 1, backgroundColor: 'purple' }}></ScrollViewWithCollapse>

const scenes = SceneMap({
  "1": Tab1,
  "2": Tab2,
})

// ...

export const Test:FC<any> = () => {
  const refTabView = useRef<RTabView>(null)
  const [routes] = useState<IRoute<TRouteData>[]>([
    { key: "1", title: "Tab 1", data: 0 },
    { key: "2", title: "Tab 2", data: 1 },
  ])

  // Declare and use props will trigger header collapse
  const renderHeader = () => {
    return <View style={{height: 200}} />
  }

  return (
    <View style={{flex: 1}}>
      <TabView ref={refTabView} routes={routes} renderScene={scenes} renderHeader={renderHeader} lazy />
    </View>
  )
}
```

## API Reference

|          name           |                                              type                                              |                        default                        |                         description                          |
| :---------------------: | :--------------------------------------------------------------------------------------------: | :---------------------------------------------------: | :----------------------------------------------------------: |
|        `routes`         |                                         `IRoute<T>[]`                                          |                                                       |     Data route to render tab bar and view (is required)      |
|    `defaultIndexTab`    |                                            `number`                                            |                           0                           |                 Default tab index when init                  |
|     `scrollEnabled`     |                                           `boolean`                                            |                         true                          |                Enable swipe between tab views                |
|         `lazy`          |                                           `boolean`                                            |                         false                         |             Lazy render tab view outside screen              |
|      `onChangeTab`      |                              `(currentIndexTab: number) => void`                               |                         false                         |            Event to catch tab current when change            |
|      `renderScene`      |                       `({ route }:{ route: IRoute<T> }) => ReactElement`                       |                                                       |         Function to render scenes view (is required)         |
|     `renderTabBar`      |                             `(props: TTabBar<T>) => ReactElement`                              |    `(props: TTabBar<T>) => <TabBar {...props} />`     |              Function to custom render tab bar               |
|     `renderHeader`      | `({ offsetActiveScrollView }:{ offsetActiveScrollView: SharedValue<number> }) => ReactElement` |                                                       | If set props auto header is rendered, custom header function |
|          `ref`          |                                           `RTabView`                                           |                                                       |                         Ref tav view                         |
| `collapseHeaderOptions` |                           `TTabViewContext['collapseHeaderOptions']`                           | {frozenTopOffset: 0; styleHeaderContainer: undefined} |                    Option collapse header                    |

### IRoute<T>

| props |   type   |
| :---: | :------: |
|  key  | `string` |
| title | `string` |
| data  |   `T`    |

### TTabBar<T>

|       props        |                       type                        |
| :----------------: | :-----------------------------------------------: |
|       routes       |                   `IRoute<T>[]`                   |
|      position      |               `SharedValue<number>`               |
|    currentIndex    |               `SharedValue<number>`               |
|  pageScrollState   | `SharedValue<'idle' \| 'dragging' \| 'settling'>` |
|  hiddenIndicator   |                     `boolean`                     |
| styleContainerList |              `StyleProp<ViewStyle>`               |
|  styleTabBarItem   |              `StyleProp<ViewStyle>`               |
|  renderTabBarItem  |      `(props: TTabBarItem) => ReactElement`       |
|  renderIndicator   |               `() => ReactElement`                |

### TTabBarItem<T>

|  props   |         type          |
| :------: | :-------------------: |
|  title   |       `string`        |
| position | `SharedValue<number>` |
|  index   |       `number`        |

### TTabViewContext

|        method         |                                    type                                    |
| :-------------------: | :------------------------------------------------------------------------: |
| collapseHeaderOptions | `{frozenTopOffset?: number; styleHeaderContainer?: StyleProp<ViewStyle>;}` |

### RTabView<T>

|   method    |             type             |
| :---------: | :--------------------------: |
| setIndexTab | `(indexTab: number) => void` |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
