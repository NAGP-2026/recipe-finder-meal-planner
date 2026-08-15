export interface Recipe {
	id: string;
	title: string;
	image: string;
	category: string;
	area: string;
	instructions: string;
	ingredients: Ingredient[];
	tags: string[];
	youtube?: string;
	source?: string;
	description?: string;
	cookTime?: string;
	servings?: string;
	isUserCreated?: boolean;
	createdAt?: number;
	rating?: number;
}

export interface Ingredient {
	name: string;
	measure: string;
}

export interface MealPlan {
	[day: string]: {
		[mealType: string]: MealSlot | null;
	};
}

export interface MealSlot {
	recipeId: string;
	recipeTitle: string;
	recipeImage: string;
}

export interface FilterState {
	category: string;
	area: string;
	sortBy: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
