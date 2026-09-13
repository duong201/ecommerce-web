import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DialogProvider, Toaster } from './common/components/ui'
import { STORAGE_KEYS } from './common/constants'

/**
 * Renders a page inside the same providers `App` gives it, so a component that
 * calls `useDialog` or pushes a toast behaves in a test exactly as it does in
 * the app.
 */
export const renderPage = (ui: React.ReactElement, route = '/'): RenderResult =>
  render(
    <DialogProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      <Toaster />
    </DialogProvider>,
  )

/** Puts a signed-in session in storage; admin pages redirect away without one. */
export const signIn = (roleId = 3): void => {
  window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'test-token')
  window.localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify({
      id: 'test-user',
      fullName: 'Test Staff',
      email: 'staff@shop.vn',
      phone: '0900000000',
      roleId,
    }),
  )
}

export const signOut = (): void => window.localStorage.clear()
