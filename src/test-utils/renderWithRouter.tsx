import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

interface RenderWithRouterOptions extends RenderOptions {
  route?: string
  path?: string
}

/**
 * Renders `ui` inside a MemoryRouter so components using Link/useHistory/useParams work.
 * Pass `route` (and `path` if the component reads route params) to control the initial location.
 */
export const renderWithRouter = (
  ui: ReactElement,
  { route = '/', path = '/', ...renderOptions }: RenderWithRouterOptions = {},
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Route path={path}>{ui}</Route>
    </MemoryRouter>,
    renderOptions,
  )
}
