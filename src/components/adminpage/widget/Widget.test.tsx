import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { buildUser, buildProduct, buildOrder } from '../../../test-utils/fixtures'
import { getUsers, getProducts, getOrders } from '../../../common/api'
import Widget from './Widget'

jest.mock('../../../common/api')

describe('Widget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .mocked(getUsers)
      .mockReturnValue(mockApiResponse([buildUser({ id: 1 }), buildUser({ id: 2 })]))
    jest
      .mocked(getProducts)
      .mockReturnValue(
        mockApiResponse(Array.from({ length: 10 }, (_, i) => buildProduct({ id: i }))),
      )
    jest
      .mocked(getOrders)
      .mockReturnValue(
        mockApiResponse([
          buildOrder({ id: 1, price: 100000 }),
          buildOrder({ id: 2, price: 472000 }),
        ]),
      )
  })

  it('renders the user count and a link to the user list', async () => {
    renderWithRouter(<Widget type="user" />)
    await screen.findByText('2')
    expect(screen.getByRole('link', { name: 'See all users' })).toHaveAttribute(
      'href',
      '/admin/list-user',
    )
  })

  it('renders the product count', async () => {
    renderWithRouter(<Widget type="product" />)
    await screen.findByText('10')
  })

  it('renders the order count', async () => {
    renderWithRouter(<Widget type="order" />)
    await screen.findByText('2')
  })

  it('renders the summed balance as currency with a $ prefix and no dead link', async () => {
    renderWithRouter(<Widget type="balance" />)
    await screen.findByText(`$ ${Intl.NumberFormat().format(572000)}`)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing for an unknown widget type', () => {
    const { container } = renderWithRouter(
      <Widget type={'unknown' as 'user' | 'product' | 'order' | 'balance'} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
