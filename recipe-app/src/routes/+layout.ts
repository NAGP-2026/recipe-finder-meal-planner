// Disable SSR for the whole app since we use localStorage-based stores
// and Stencil web components which require browser APIs
export const ssr = false;
export const prerender = false;
