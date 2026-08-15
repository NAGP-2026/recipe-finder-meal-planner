# meal-plan-card



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default    |
| ------------- | -------------- | ----------- | --------- | ---------- |
| `day`         | `day`          |             | `string`  | `''`       |
| `isEmpty`     | `is-empty`     |             | `boolean` | `false`    |
| `mealType`    | `meal-type`    |             | `string`  | `'dinner'` |
| `recipeId`    | `recipe-id`    |             | `string`  | `''`       |
| `recipeImage` | `recipe-image` |             | `string`  | `''`       |
| `recipeTitle` | `recipe-title` |             | `string`  | `''`       |


## Events

| Event           | Description | Type                                              |
| --------------- | ----------- | ------------------------------------------------- |
| `mealRemove`    |             | `CustomEvent<{ day: string; mealType: string; }>` |
| `mealSlotClick` |             | `CustomEvent<{ day: string; mealType: string; }>` |
| `viewRecipe`    |             | `CustomEvent<string>`                             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
