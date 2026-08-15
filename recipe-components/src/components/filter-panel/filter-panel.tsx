import { Component, Prop, Event, EventEmitter, State, h, Host, Watch } from '@stencil/core';

export interface FilterOption {
  value: string;
  label: string;
}

@Component({
  tag: 'filter-panel',
  styleUrl: 'filter-panel.css',
  shadow: true,
})
export class FilterPanel {
  @Prop() categories: string = '[]';
  @Prop() areas: string = '[]';
  @Prop() selectedCategory: string = '';
  @Prop() selectedArea: string = '';
  @Prop() sortBy: string = 'default';

  @State() localCategory: string = '';
  @State() localArea: string = '';
  @State() localSort: string = 'default';
  @State() isExpanded: boolean = true;

  @Event() filterChange: EventEmitter<{ category: string; area: string; sortBy: string }>;
  @Event() filterReset: EventEmitter<void>;

  @Watch('selectedCategory')
  categoryChanged(val: string) { this.localCategory = val; }
  @Watch('selectedArea')
  areaChanged(val: string) { this.localArea = val; }
  @Watch('sortBy')
  sortChanged(val: string) { this.localSort = val; }

  componentWillLoad() {
    this.localCategory = this.selectedCategory;
    this.localArea = this.selectedArea;
    this.localSort = this.sortBy;
  }

  private getCategories(): FilterOption[] {
    try { return JSON.parse(this.categories); }
    catch { return []; }
  }

  private getAreas(): FilterOption[] {
    try { return JSON.parse(this.areas); }
    catch { return []; }
  }

  private emitChange() {
    this.filterChange.emit({
      category: this.localCategory,
      area: this.localArea,
      sortBy: this.localSort,
    });
  }

  private handleCategoryChange(val: string) {
    this.localCategory = val;
    this.emitChange();
  }

  private handleAreaChange(val: string) {
    this.localArea = val;
    this.emitChange();
  }

  private handleSortChange(val: string) {
    this.localSort = val;
    this.emitChange();
  }

  private handleReset() {
    this.localCategory = '';
    this.localArea = '';
    this.localSort = 'default';
    this.filterReset.emit();
  }

  private hasActiveFilters(): boolean {
    return !!(this.localCategory || this.localArea || this.localSort !== 'default');
  }

  render() {
    const categories = this.getCategories();
    const areas = this.getAreas();

    return (
      <Host>
        <div class="filter-panel">
          <div class="filter-header" onClick={() => { this.isExpanded = !this.isExpanded; }}>
            <div class="header-left">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filters</span>
              {this.hasActiveFilters() && <span class="active-badge">Active</span>}
            </div>
            <svg
              class={`chevron ${this.isExpanded ? 'expanded' : ''}`}
              viewBox="0 0 24 24" width="18" height="18"
              fill="none" stroke="currentColor" stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {this.isExpanded && (
            <div class="filter-body">
              <div class="filter-group">
                <label class="filter-label">Category</label>
                <select
                  class="filter-select"
                  onChange={(e) => this.handleCategoryChange((e.target as HTMLSelectElement).value)}
                >
                  <option value="" selected={this.localCategory === ''}>All Categories</option>
                  {categories.map(cat => (
                    <option value={cat.value} selected={this.localCategory === cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Cuisine</label>
                <select
                  class="filter-select"
                  onChange={(e) => this.handleAreaChange((e.target as HTMLSelectElement).value)}
                >
                  <option value="" selected={this.localArea === ''}>All Cuisines</option>
                  {areas.map(area => (
                    <option value={area.value} selected={this.localArea === area.value}>{area.label}</option>
                  ))}
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Sort By</label>
                <select
                  class="filter-select"
                  onChange={(e) => this.handleSortChange((e.target as HTMLSelectElement).value)}
                >
                  <option value="default" selected={this.localSort === 'default'}>Default</option>
                  <option value="name-asc" selected={this.localSort === 'name-asc'}>Name (A-Z)</option>
                  <option value="name-desc" selected={this.localSort === 'name-desc'}>Name (Z-A)</option>
                </select>
              </div>

              {this.hasActiveFilters() && (
                <button class="reset-btn" onClick={() => this.handleReset()}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                  </svg>
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
