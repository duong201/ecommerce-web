/** Wraps a value the way axios would: resolved promise with a `.data` payload. */
export const mockApiResponse = (data) => Promise.resolve({ data })
