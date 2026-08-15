import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'loading-spinner',
  styleUrl: 'loading-spinner.css',
  shadow: true,
})
export class LoadingSpinner {
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() message: string = '';
  @Prop() fullPage: boolean = false;

  render() {
    return (
      <Host>
        <div class={`spinner-container ${this.fullPage ? 'full-page' : ''}`}>
          <div class={`spinner spinner-${this.size}`}>
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
            <div class="dot"></div>
          </div>
          {this.message && <p class="spinner-message">{this.message}</p>}
        </div>
      </Host>
    );
  }
}
