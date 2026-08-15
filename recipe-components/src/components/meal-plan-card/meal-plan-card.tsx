import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'meal-plan-card',
  styleUrl: 'meal-plan-card.css',
  shadow: true,
})
export class MealPlanCard {
  @Prop() day: string = '';
  @Prop() mealType: string = 'dinner';
  @Prop() recipeId: string = '';
  @Prop() recipeTitle: string = '';
  @Prop() recipeImage: string = '';
  @Prop() isEmpty: boolean = false;

  @Event() mealRemove: EventEmitter<{ day: string; mealType: string }>;
  @Event() mealSlotClick: EventEmitter<{ day: string; mealType: string }>;
  @Event() viewRecipe: EventEmitter<string>;

  private handleRemove(e: Event) {
    e.stopPropagation();
    this.mealRemove.emit({ day: this.day, mealType: this.mealType });
  }

  private handleSlotClick() {
    this.mealSlotClick.emit({ day: this.day, mealType: this.mealType });
  }

  private handleViewRecipe(e: Event) {
    e.stopPropagation();
    this.viewRecipe.emit(this.recipeId);
  }

  private getMealIcon() {
    const icons: Record<string, string> = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎',
    };
    return icons[this.mealType] || '🍽️';
  }

  render() {
    if (this.isEmpty) {
      return (
        <Host>
          <div class="meal-slot empty" onClick={() => this.handleSlotClick()}>
            <div class="meal-type-header">
              <span class="meal-icon">{this.getMealIcon()}</span>
              <span class="meal-type-label">{this.mealType}</span>
            </div>
            <div class="empty-content">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Add recipe</span>
            </div>
          </div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="meal-slot filled">
          <div class="meal-type-header">
            <span class="meal-icon">{this.getMealIcon()}</span>
            <span class="meal-type-label">{this.mealType}</span>
            <button class="remove-btn" onClick={(e) => this.handleRemove(e)} title="Remove meal">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="meal-content" onClick={(e) => this.handleViewRecipe(e)}>
            {this.recipeImage && (
              <img src={this.recipeImage} alt={this.recipeTitle} class="meal-image" />
            )}
            <p class="meal-title">{this.recipeTitle}</p>
          </div>
        </div>
      </Host>
    );
  }
}
