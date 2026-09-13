import React, { useState } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  Badge,
  Button,
  Checkbox,
  DialogProvider,
  Input,
  Modal,
  Pagination,
  Rating,
  Table,
  Toaster,
  useDialog,
} from '../common/components/ui'
import { toast } from '../common/utils/toast'
import { applyStoredTheme, useTheme } from '../common/hooks/useTheme'

describe('form controls', () => {
  it('wires a label, hint and error to the input', () => {
    render(<Input label="Coupon code" hint="Case insensitive" />)

    const field = screen.getByLabelText(/coupon code/i)
    expect(field).toBeInTheDocument()
    expect(screen.getByText(/case insensitive/i)).toBeInTheDocument()

    render(<Input label="Phone" error="Required" />)
    const invalid = screen.getByLabelText(/phone/i)
    expect(invalid).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('toggles a checkbox through its label', () => {
    const onChange = jest.fn()
    render(<Checkbox label="Organic only" onChange={onChange} />)

    fireEvent.click(screen.getByLabelText(/organic only/i))
    expect(onChange).toHaveBeenCalled()
  })

  it('does not fire a disabled or loading button', () => {
    const onClick = jest.fn()
    render(
      <>
        <Button disabled onClick={onClick}>
          Save
        </Button>
        <Button loading onClick={onClick}>
          Submit
        </Button>
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('aria-busy', 'true')
  })
})

describe('Modal', () => {
  const Harness = () => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onClose={() => setOpen(false)} title="Delete batch">
        <input aria-label="Reason" />
      </Modal>
    )
  }

  it('closes on Escape and restores page scrolling', async () => {
    render(<Harness />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.body).toHaveStyle('overflow: hidden')

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe('')
  })
})

describe('dialogs replacing window.confirm and window.prompt', () => {
  const ConfirmHarness = ({ onResult }: { onResult: (value: boolean) => void }) => {
    const { confirm } = useDialog()
    return (
      <Button
        onClick={async () => onResult(await confirm({ title: 'Empty the cart?', tone: 'danger' }))}
      >
        Empty
      </Button>
    )
  }

  const PromptHarness = ({ onResult }: { onResult: (value: string | null) => void }) => {
    const { prompt } = useDialog()
    return (
      <Button
        onClick={async () =>
          onResult(
            await prompt({
              title: 'Measured weight',
              label: 'Quantity',
              inputType: 'number',
              required: true,
            }),
          )
        }
      >
        Weigh
      </Button>
    )
  }

  it('resolves true when confirmed and false when dismissed', async () => {
    const onResult = jest.fn()
    render(
      <DialogProvider>
        <ConfirmHarness onResult={onResult} />
      </DialogProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /empty/i }))
    fireEvent.click(await screen.findByRole('button', { name: /^confirm$/i }))
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true))

    fireEvent.click(screen.getByRole('button', { name: /empty/i }))
    fireEvent.click(await screen.findByRole('button', { name: /^cancel$/i }))
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false))
  })

  it('blocks an empty required prompt, then resolves the entered value', async () => {
    const onResult = jest.fn()
    render(
      <DialogProvider>
        <PromptHarness onResult={onResult} />
      </DialogProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /weigh/i }))
    fireEvent.click(await screen.findByRole('button', { name: /^confirm$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/required/i)
    expect(onResult).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '1.4' } })
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }))
    await waitFor(() => expect(onResult).toHaveBeenCalledWith('1.4'))
  })

  it('resolves null when a prompt is dismissed', async () => {
    const onResult = jest.fn()
    render(
      <DialogProvider>
        <PromptHarness onResult={onResult} />
      </DialogProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /weigh/i }))
    fireEvent.click(await screen.findByRole('button', { name: /^cancel$/i }))
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(null))
  })
})

describe('Toaster', () => {
  it('shows a toast, caps the queue at three and dismisses on click', async () => {
    render(<Toaster />)

    // The toast queue lives outside React, so pushing to it is a state update
    // that has to be wrapped for the renderer to flush it.
    act(() => {
      toast.success('Saved')
    })
    expect(await screen.findByText('Saved')).toBeInTheDocument()

    act(() => {
      toast.error('One')
      toast.warning('Two')
      toast.info('Three')
    })
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
    expect(screen.getAllByRole('button', { name: /dismiss/i })).toHaveLength(3)

    fireEvent.click(screen.getAllByRole('button', { name: /dismiss/i })[0])
    await waitFor(() => expect(screen.getAllByRole('button', { name: /dismiss/i })).toHaveLength(2))
  })
})

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('windows the page numbers and marks the current one', () => {
    render(<Pagination page={10} totalPages={40} onChange={() => {}} />)

    expect(screen.getByRole('button', { name: '10' })).toHaveAttribute('aria-current', 'page')
    // First, last and the neighbours of 10 - not forty buttons.
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '40' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '20' })).not.toBeInTheDocument()
  })

  it('disables the arrows at each end', () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()

    rerender(<Pagination page={5} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})

describe('data display', () => {
  it('shows an empty state instead of a bare table', () => {
    render(
      <Table columns={[{ key: 'name', header: 'Name' }]} rows={[]} emptyTitle="No suppliers yet" />,
    )
    expect(screen.getByText(/no suppliers yet/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('labels each cell for the stacked phone layout', () => {
    render(
      <Table
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'name', header: 'Supplier' },
        ]}
        rows={[{ id: '1', code: 'S-1', name: 'Cai Mon Orchard' }]}
      />,
    )
    expect(screen.getByText('Cai Mon Orchard')).toHaveAttribute('data-label', 'Supplier')
  })

  it('describes a rating for assistive tech', () => {
    render(<Rating value={4.5} count={12} />)
    expect(screen.getByRole('img', { name: /4\.5 out of 5/i })).toBeInTheDocument()
    expect(screen.getByText('(12)')).toBeInTheDocument()
  })

  it('renders a badge with its tone class', () => {
    render(
      <MemoryRouter>
        <Badge tone="danger" variant="solid">
          Cancelled
        </Badge>
      </MemoryRouter>,
    )
    expect(screen.getByText('Cancelled')).toHaveClass('ui-badge--danger', 'ui-badge--solid')
  })
})

describe('theme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    window.localStorage.clear()
  })

  it('stamps data-theme on the root and remembers the choice', () => {
    const ThemeHarness = () => {
      const { resolved, toggle } = useTheme()
      return (
        <button type="button" onClick={toggle}>
          {resolved}
        </button>
      )
    }

    render(<ThemeHarness />)

    // Nothing is stamped while the preference is "system".
    expect(document.documentElement).not.toHaveAttribute('data-theme')
    expect(screen.getByRole('button')).toHaveTextContent('light')

    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('fs.theme')).toBe('dark')

    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('applies a stored preference before the first render', () => {
    window.localStorage.setItem('fs.theme', 'dark')
    applyStoredTheme()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })
})
