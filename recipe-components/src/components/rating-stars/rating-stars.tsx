import { Component, Prop, Event, EventEmitter, State, h, Host } from '@stencil/core';

@Component({
  tag: 'rating-stars',
  styleUrl: 'rating-stars.css',
  shadow: true,
})
export class RatingStars {
  @Prop() rating: number = 0;
  @Prop() maxRating: number = 5;
  @Prop() readonly: boolean = false;
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() showValue: boolean = true;

  @State() hoverRating: number = 0;

  @Event() ratingChange: EventEmitter<number>;

  private handleClick(rating: number) {
    if (!this.readonly) {
      this.ratingChange.emit(rating);
    }
  }

  private handleMouseEnter(rating: number) {
    if (!this.readonly) {
      this.hoverRating = rating;
    }
  }

  private handleMouseLeave() {
    if (!this.readonly) {
      this.hoverRating = 0;
    }
  }

  render() {
    const displayRating = this.hoverRating || this.rating;

    return (
      <Host>
        <div class={`rating-container rating-${this.size} ${this.readonly ? 'readonly' : 'interactive'}`}>
          {Array.from({ length: this.maxRating }, (_, i) => i + 1).map(star => (
            <button
              class={`star-btn ${star <= displayRating ? 'filled' : 'empty'}`}
              onClick={() => this.handleClick(star)}
              onMouseEnter={() => this.handleMouseEnter(star)}
              onMouseLeave={() => this.handleMouseLeave()}
              disabled={this.readonly}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''} out of ${this.maxRating}`}
              title={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill={star <= displayRating ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
          {this.showValue && (
            <span class="rating-value">{this.rating > 0 ? this.rating.toFixed(1) : 'Rate'}</span>
          )}
        </div>
      </Host>
    );
  }
}
