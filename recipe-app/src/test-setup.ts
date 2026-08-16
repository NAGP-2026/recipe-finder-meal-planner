/**
 * Vitest global test setup
 * Provides a localStorage mock for stores that persist to localStorage.
 */

const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem(key: string): string | null {
			return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
		},
		setItem(key: string, value: string): void {
			store[key] = value;
		},
		removeItem(key: string): void {
			delete store[key];
		},
		clear(): void {
			store = {};
		},
		get length(): number {
			return Object.keys(store).length;
		},
		key(index: number): string | null {
			return Object.keys(store)[index] ?? null;
		},
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true,
});
