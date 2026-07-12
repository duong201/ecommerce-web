import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

/**
 * Renders `ui` inside a MemoryRouter so components using Link/useHistory/useParams work.
 * Pass `route` (and `path` if the component reads route params) to control the initial location.
 */
export const renderWithRouter = (ui, { route = '/', path = '/', ...renderOptions } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Route path={path}>{ui}</Route>
    </MemoryRouter>,
    renderOptions
  )
}
