import '@testing-library/jest-dom'

// jsdom implements neither of these, and both are reached during a normal
// render: recharts' ResponsiveContainer observes its box, and the theme hook
// asks the platform for the colour-scheme preference.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
