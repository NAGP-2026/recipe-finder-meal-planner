# filter-panel



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type     | Default     |
| ------------------ | ------------------- | ----------- | -------- | ----------- |
| `areas`            | `areas`             |             | `string` | `'[]'`      |
| `categories`       | `categories`        |             | `string` | `'[]'`      |
| `selectedArea`     | `selected-area`     |             | `string` | `''`        |
| `selectedCategory` | `selected-category` |             | `string` | `''`        |
| `sortBy`           | `sort-by`           |             | `string` | `'default'` |


## Events

| Event          | Description | Type                                                               |
| -------------- | ----------- | ------------------------------------------------------------------ |
| `filterChange` |             | `CustomEvent<{ category: string; area: string; sortBy: string; }>` |
| `filterReset`  |             | `CustomEvent<void>`                                                |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
