import { Component, Prop, Event, EventEmitter, State, h, Host, Watch } from '@stencil/core';

export interface RecipeFormData {
  id?: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  category: string;
  area: string;
  cookTime: string;
  servings: string;
  image: string;
  tags: string;
}

@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeForm {
  @Prop() recipeData: string = '{}';
  @Prop() isEditing: boolean = false;
  @Prop() categories: string = '[]';

  @State() formData: RecipeFormData = {
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: '',
    area: '',
    cookTime: '',
    servings: '',
    image: '',
    tags: '',
  };

  @State() errors: Partial<RecipeFormData> = {};
  @State() submitted: boolean = false;

  @Event() formSubmit: EventEmitter<RecipeFormData>;
  @Event() formCancel: EventEmitter<void>;

  @Watch('recipeData')
  recipeDataChanged(val: string) {
    try {
      const data = JSON.parse(val);
      if (data && data.title) {
        this.formData = { ...this.formData, ...data };
      }
    } catch { /* */ }
  }

  componentWillLoad() {
    try {
      const data = JSON.parse(this.recipeData);
      if (data && data.title) {
        this.formData = { ...this.formData, ...data };
      }
    } catch { /* */ }
  }

  private validate(): boolean {
    const newErrors: Partial<RecipeFormData> = {};

    if (!this.formData.title?.trim()) {
      newErrors.title = 'Recipe title is required';
    } else if (this.formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!this.formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!this.formData.ingredients?.trim()) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    if (!this.formData.instructions?.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!this.formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (this.formData.servings && isNaN(Number(this.formData.servings))) {
      newErrors.servings = 'Servings must be a number';
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  private handleFieldChange(field: keyof RecipeFormData, value: string) {
    this.formData = { ...this.formData, [field]: value };
    if (this.submitted && this.errors[field]) {
      this.errors = { ...this.errors, [field]: undefined };
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;

    if (this.validate()) {
      this.formSubmit.emit({ ...this.formData });
    }
  }

  private getCategories(): string[] {
    try {
      const cats = JSON.parse(this.categories);
      return cats.map((c: { value: string; label: string } | string) =>
        typeof c === 'string' ? c : c.value
      );
    } catch { return []; }
  }

  render() {
    const cats = this.getCategories();

    return (
      <Host>
        <form class="recipe-form" onSubmit={(e) => this.handleSubmit(e)} novalidate>
          <div class="form-grid">
            <div class={`form-group ${this.errors.title ? 'has-error' : ''}`}>
              <label class="form-label">
                Recipe Title <span class="required">*</span>
              </label>
              <input
                type="text"
                class="form-input"
                placeholder="Enter recipe title..."
                value={this.formData.title}
                onInput={(e) => this.handleFieldChange('title', (e.target as HTMLInputElement).value)}
              />
              {this.errors.title && <span class="error-msg">{this.errors.title}</span>}
            </div>

            <div class={`form-group ${this.errors.description ? 'has-error' : ''}`}>
              <label class="form-label">
                Description <span class="required">*</span>
              </label>
              <textarea
                class="form-textarea"
                placeholder="Brief description of the recipe..."
                rows={3}
                onInput={(e) => this.handleFieldChange('description', (e.target as HTMLTextAreaElement).value)}
              >{this.formData.description}</textarea>
              {this.errors.description && <span class="error-msg">{this.errors.description}</span>}
            </div>

            <div class="form-row">
              <div class={`form-group ${this.errors.category ? 'has-error' : ''}`}>
                <label class="form-label">
                  Category <span class="required">*</span>
                </label>
                {cats.length > 0 ? (
                  <select
                    class="form-select"
                    onChange={(e) => this.handleFieldChange('category', (e.target as HTMLSelectElement).value)}
                  >
                    <option value="" selected={!this.formData.category}>Select category...</option>
                    {cats.map(cat => (
                      <option value={cat} selected={this.formData.category === cat}>{cat}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    class="form-input"
                    placeholder="e.g. Chicken, Dessert..."
                    value={this.formData.category}
                    onInput={(e) => this.handleFieldChange('category', (e.target as HTMLInputElement).value)}
                  />
                )}
                {this.errors.category && <span class="error-msg">{this.errors.category}</span>}
              </div>

              <div class="form-group">
                <label class="form-label">Cuisine / Area</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="e.g. Italian, Indian..."
                  value={this.formData.area}
                  onInput={(e) => this.handleFieldChange('area', (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cook Time</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="e.g. 30 mins"
                  value={this.formData.cookTime}
                  onInput={(e) => this.handleFieldChange('cookTime', (e.target as HTMLInputElement).value)}
                />
              </div>

              <div class={`form-group ${this.errors.servings ? 'has-error' : ''}`}>
                <label class="form-label">Servings</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="e.g. 4"
                  value={this.formData.servings}
                  onInput={(e) => this.handleFieldChange('servings', (e.target as HTMLInputElement).value)}
                />
                {this.errors.servings && <span class="error-msg">{this.errors.servings}</span>}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input
                type="url"
                class="form-input"
                placeholder="https://example.com/image.jpg"
                value={this.formData.image}
                onInput={(e) => this.handleFieldChange('image', (e.target as HTMLInputElement).value)}
              />
            </div>

            <div class={`form-group ${this.errors.ingredients ? 'has-error' : ''}`}>
              <label class="form-label">
                Ingredients <span class="required">*</span>
                <span class="hint">(one per line)</span>
              </label>
              <textarea
                class="form-textarea"
                placeholder="1 cup flour&#10;2 eggs&#10;1 tsp salt..."
                rows={6}
                onInput={(e) => this.handleFieldChange('ingredients', (e.target as HTMLTextAreaElement).value)}
              >{this.formData.ingredients}</textarea>
              {this.errors.ingredients && <span class="error-msg">{this.errors.ingredients}</span>}
            </div>

            <div class={`form-group ${this.errors.instructions ? 'has-error' : ''}`}>
              <label class="form-label">
                Instructions <span class="required">*</span>
                <span class="hint">(step by step)</span>
              </label>
              <textarea
                class="form-textarea"
                placeholder="Step 1: Preheat oven to 350°F...&#10;Step 2: Mix ingredients..."
                rows={8}
                onInput={(e) => this.handleFieldChange('instructions', (e.target as HTMLTextAreaElement).value)}
              >{this.formData.instructions}</textarea>
              {this.errors.instructions && <span class="error-msg">{this.errors.instructions}</span>}
            </div>

            <div class="form-group">
              <label class="form-label">Tags <span class="hint">(comma separated)</span></label>
              <input
                type="text"
                class="form-input"
                placeholder="e.g. vegetarian, quick, healthy"
                value={this.formData.tags}
                onInput={(e) => this.handleFieldChange('tags', (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" onClick={() => this.formCancel.emit()}>
              Cancel
            </button>
            <button type="submit" class="btn-submit">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {this.isEditing ? 'Update Recipe' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </Host>
    );
  }
}
