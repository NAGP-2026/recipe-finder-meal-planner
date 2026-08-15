import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() recipeId: string = '';
  @Prop() recipeTitle: string = '';
  @Prop() image: string = '';
  @Prop() category: string = '';
  @Prop() area: string = '';
  @Prop() isFavorite: boolean = false;
  @Prop() isUserCreated: boolean = false;
  @Prop() cookTime: string = '';
  @Prop() servings: string = '';

  @Event() cardClick: EventEmitter<string>;
  @Event() favoriteToggle: EventEmitter<{ id: string; isFavorite: boolean }>;
  @Event() addToMealPlan: EventEmitter<string>;
  @Event() editRecipe: EventEmitter<string>;
  @Event() deleteRecipe: EventEmitter<string>;

  private handleCardClick() { this.cardClick.emit(this.recipeId); }

  private handleFavoriteClick(e: Event) {
    e.stopPropagation();
    this.favoriteToggle.emit({ id: this.recipeId, isFavorite: !this.isFavorite });
  }

  private handleAddToMealPlan(e: Event) {
    e.stopPropagation();
    this.addToMealPlan.emit(this.recipeId);
  }

  private handleEdit(e: Event) {
    e.stopPropagation();
    this.editRecipe.emit(this.recipeId);
  }

  private handleDelete(e: Event) {
    e.stopPropagation();
    this.deleteRecipe.emit(this.recipeId);
  }

  render() {
    const fallbackImg = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80`;
    const imgSrc = this.image || fallbackImg;

    return (
      <Host>
        <div class="recipe-card" onClick={() => this.handleCardClick()}>

          {/* ── Image Area ── */}
          <div class="card-image-wrap">
            <img
              src={imgSrc}
              alt={this.recipeTitle}
              class="card-image"
              loading="lazy"
              onError={(e: any) => { e.target.src = fallbackImg; }}
            />
            <div class="card-image-overlay"></div>

            {/* Top overlay row: badges + fav btn */}
            <div class="card-top-row">
              <div class="badge-group">
                {this.category && (
                  <span class="cat-badge category">{this.category}</span>
                )}
                {this.area && (
                  <span class="cat-badge area">🌍 {this.area}</span>
                )}
                {this.isUserCreated && (
                  <span class="user-badge">✨ My Recipe</span>
                )}
              </div>
              <button
                class={`fav-overlay-btn ${this.isFavorite ? 'is-fav' : ''}`}
                onClick={(e) => this.handleFavoriteClick(e)}
                title={this.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                {this.isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* ── Card Content ── */}
          <div class="card-content">
            <h3 class="card-title">{this.recipeTitle}</h3>

            {(this.cookTime || this.servings) && (
              <div class="card-meta">
                {this.cookTime && (
                  <span class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    {this.cookTime}
                  </span>
                )}
                {this.servings && (
                  <span class="meta-item">
                    <span class="meta-icon">👥</span>
                    {this.servings}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div class={`card-actions ${this.isUserCreated ? 'three-col' : ''}`}>
              <button
                class="action-btn view"
                onClick={() => this.handleCardClick()}
              >
                <span class="btn-icon">👁️</span>
                View
              </button>

              <button
                class="action-btn plan"
                onClick={(e) => this.handleAddToMealPlan(e)}
              >
                <span class="btn-icon">📅</span>
                Plan
              </button>

              {this.isUserCreated && (
                <button
                  class="action-btn edit"
                  onClick={(e) => this.handleEdit(e)}
                >
                  <span class="btn-icon">✏️</span>
                  Edit
                </button>
              )}
            </div>

            {this.isUserCreated && (
              <button
                class="action-btn delete"
                style={{ width: '100%', marginTop: '6px' }}
                onClick={(e) => this.handleDelete(e)}
              >
                <span class="btn-icon">🗑️</span>
                Delete Recipe
              </button>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
