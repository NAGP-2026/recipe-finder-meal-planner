# recipe-card



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description | Type      | Default |
| --------------- | ----------------- | ----------- | --------- | ------- |
| `area`          | `area`            |             | `string`  | `''`    |
| `category`      | `category`        |             | `string`  | `''`    |
| `cookTime`      | `cook-time`       |             | `string`  | `''`    |
| `image`         | `image`           |             | `string`  | `''`    |
| `isFavorite`    | `is-favorite`     |             | `boolean` | `false` |
| `isUserCreated` | `is-user-created` |             | `boolean` | `false` |
| `recipeId`      | `recipe-id`       |             | `string`  | `''`    |
| `recipeTitle`   | `recipe-title`    |             | `string`  | `''`    |
| `servings`      | `servings`        |             | `string`  | `''`    |


## Events

| Event            | Description | Type                                                |
| ---------------- | ----------- | --------------------------------------------------- |
| `addToMealPlan`  |             | `CustomEvent<string>`                               |
| `cardClick`      |             | `CustomEvent<string>`                               |
| `deleteRecipe`   |             | `CustomEvent<string>`                               |
| `editRecipe`     |             | `CustomEvent<string>`                               |
| `favoriteToggle` |             | `CustomEvent<{ id: string; isFavorite: boolean; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
