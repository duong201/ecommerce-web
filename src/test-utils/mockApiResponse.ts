import type { AxiosResponse } from 'axios'

/** Wraps a value the way axios would: resolved promise with a `.data` payload. */
export const mockApiResponse = <T>(data: T): Promise<AxiosResponse<T>> =>
  Promise.resolve({ data } as AxiosResponse<T>)
