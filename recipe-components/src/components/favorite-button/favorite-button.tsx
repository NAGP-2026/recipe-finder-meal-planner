import { Component, Prop, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'favorite-button',
  styleUrl: 'favorite-button.css',
  shadow: true,
})
export class FavoriteButton {
  @Prop() recipeId: string = '';
  @Prop() isFavorite: boolean = false;
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() showLabel: boolean = false;
  @Prop() variant: 'icon' | 'button' = 'button';

  @Event() favoriteToggle: EventEmitter<{ id: string; isFavorite: boolean }>;

  private handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.favoriteToggle.emit({ id: this.recipeId, isFavorite: !this.isFavorite });
  }

  render() {
    const label = this.isFavorite ? 'Remove from Favorites' : 'Add to Favorites';

    return (
      <Host>
        <button
          class={`fav-btn fav-${this.size} fav-${this.variant} ${this.isFavorite ? 'is-favorite' : ''}`}
          onClick={(e) => this.handleClick(e)}
          aria-label={label}
          aria-pressed={this.isFavorite}
          title={label}
        >
          <svg
            class="heart-icon"
            viewBox="0 0 24 24"
            fill={this.isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {this.showLabel && <span class="fav-label">{label}</span>}
        </button>
      </Host>
    );
  }
}
