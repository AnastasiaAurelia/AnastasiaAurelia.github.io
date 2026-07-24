import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia; useTheme() relies on it to read the
// OS-level color-scheme preference on first mount.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
