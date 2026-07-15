import message from 'antd/lib/message'
import { toast } from './toast'

jest.mock('antd/lib/message', () => ({
  config: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
}))

describe('toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('delegates each method to the underlying antd message API', () => {
    toast.success('ok')
    toast.error('nope')
    toast.warning('careful')
    toast.info('fyi')

    expect(message.success).toHaveBeenCalledWith('ok')
    expect(message.error).toHaveBeenCalledWith('nope')
    expect(message.warning).toHaveBeenCalledWith('careful')
    expect(message.info).toHaveBeenCalledWith('fyi')
  })
})
