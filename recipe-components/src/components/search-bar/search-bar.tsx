import { Component, Prop, Event, EventEmitter, State, h, Host, Watch } from '@stencil/core';

@Component({
  tag: 'search-bar',
  styleUrl: 'search-bar.css',
  shadow: true,
})
export class SearchBar {
  @Prop() placeholder: string = 'Search recipes...';
  @Prop() value: string = '';
  @Prop() debounceMs: number = 400;

  @State() inputValue: string = '';

  @Event() searchChange: EventEmitter<string>;
  @Event() searchSubmit: EventEmitter<string>;
  @Event() searchClear: EventEmitter<void>;

  private debounceTimer: ReturnType<typeof setTimeout>;

  @Watch('value')
  valueChanged(newVal: string) {
    this.inputValue = newVal;
  }

  componentWillLoad() {
    this.inputValue = this.value;
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit(this.inputValue);
    }, this.debounceMs);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      clearTimeout(this.debounceTimer);
      this.searchSubmit.emit(this.inputValue);
    }
    if (e.key === 'Escape') {
      this.clearSearch();
    }
  }

  private clearSearch() {
    this.inputValue = '';
    this.searchClear.emit();
    this.searchChange.emit('');
  }

  render() {
    return (
      <Host>
        <div class="search-wrapper">
          <div class="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            class="search-input"
            placeholder={this.placeholder}
            value={this.inputValue}
            onInput={(e) => this.handleInput(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
          />
          {this.inputValue && (
            <button class="clear-btn" onClick={() => this.clearSearch()} title="Clear search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            class="search-btn"
            onClick={() => this.searchSubmit.emit(this.inputValue)}
            title="Search"
          >
            Search
          </button>
        </div>
      </Host>
    );
  }
}
