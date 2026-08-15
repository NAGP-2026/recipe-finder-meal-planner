import { Component, Prop, Event, EventEmitter, State, h, Host, Watch, Element } from '@stencil/core';

@Component({
  tag: 'recipe-modal',
  styleUrl: 'recipe-modal.css',
  shadow: true,
})
export class RecipeModal {
  @Element() el!: HTMLElement;

  @Prop() open: boolean = false;
  @Prop() modalTitle: string = '';
  @Prop() size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium';

  @State() isVisible: boolean = false;

  @Event() modalClose: EventEmitter<void>;
  @Event() modalConfirm: EventEmitter<void>;

  @Watch('open')
  openChanged(isOpen: boolean) {
    if (isOpen) {
      this.isVisible = true;
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        this.isVisible = false;
        document.body.style.overflow = '';
      }, 200);
    }
  }

  componentWillLoad() {
    this.isVisible = this.open;
  }

  private handleOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.modalClose.emit();
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.modalClose.emit();
    }
  }

  render() {
    if (!this.isVisible && !this.open) return null;

    return (
      <Host>
        <div
          class={`modal-overlay ${this.open ? 'open' : 'closing'}`}
          onClick={(e) => this.handleOverlayClick(e)}
          onKeyDown={(e) => this.handleKeyDown(e)}
        >
          <div class={`modal-container modal-${this.size}`} role="dialog" aria-modal="true">
            <div class="modal-header">
              <h2 class="modal-title">{this.modalTitle}</h2>
              <button class="close-btn" onClick={() => this.modalClose.emit()} title="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button class="btn-cancel" onClick={() => this.modalClose.emit()}>Cancel</button>
                <button class="btn-confirm" onClick={() => this.modalConfirm.emit()}>Confirm</button>
              </slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
