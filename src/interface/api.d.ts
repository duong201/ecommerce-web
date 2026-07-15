import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    silentError?: boolean
  }
}
