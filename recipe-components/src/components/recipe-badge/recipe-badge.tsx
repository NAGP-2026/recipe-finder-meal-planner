import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'recipe-badge',
  styleUrl: 'recipe-badge.css',
  shadow: true,
})
export class RecipeBadge {
  @Prop() label: string = '';
  @Prop() variant: 'category' | 'area' | 'tag' | 'user' | 'success' | 'warning' | 'error' | 'info' = 'tag';
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  @Prop() icon: string = '';

  render() {
    return (
      <Host>
        <span class={`badge badge-${this.variant} badge-${this.size}`}>
          {this.icon && <span class="badge-icon">{this.icon}</span>}
          <slot>{this.label}</slot>
        </span>
      </Host>
    );
  }
}
