import axios from 'axios'
import { API_BASE_URL } from '../constants'
import { getErrorMessage } from '../utils/errorMessage'
import { toast } from '../utils/toast'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.friendlyMessage = getErrorMessage(error)
    // Forms display their own inline error below the relevant input, so they pass
    // `silentError: true` to suppress the global toast for that one request.
    if (!error.config?.silentError) {
      toast.error(error.friendlyMessage)
    }
    return Promise.reject(error)
  },
)

export default apiClient
