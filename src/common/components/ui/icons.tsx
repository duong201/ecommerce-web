import React from 'react'

/**
 * The app's icon set.
 *
 * These replaced `@mui/icons-material`, which pulled the whole Material
 * Design language (and, through `@mui/material`, Emotion's runtime) into a UI
 * that is otherwise driven by our own tokens. Every glyph here is a 24x24
 * stroked path on `currentColor` at a single weight, sized in `em` so the
 * surrounding CSS decides how big it is.
 */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Overrides the 1em default; any CSS length. */
  size?: string | number
}

const Icon = ({ size, children, ...rest }: React.PropsWithChildren<IconProps>) => (
  <svg
    viewBox="0 0 24 24"
    width={size ?? '1em'}
    height={size ?? '1em'}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

/** Solid-fill variant, for brand marks that read badly as outlines. */
const SolidIcon = ({ size, children, ...rest }: React.PropsWithChildren<IconProps>) => (
  <svg
    viewBox="0 0 24 24"
    width={size ?? '1em'}
    height={size ?? '1em'}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

// --- navigation and chrome ---------------------------------------------------

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
)

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
)

export const ChevronLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
)

export const ChevronRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 5l7 7-7 7" />
  </Icon>
)

export const ExpandMoreIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 9l7 7 7-7" />
  </Icon>
)

export const AddIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const TuneIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="16" cy="18" r="2" />
  </Icon>
)

export const ListIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
  </Icon>
)

// --- account and people ------------------------------------------------------

export const PersonOutlineIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Icon>
)

export const PermIdentityIcon = PersonOutlineIcon
export const PersonOutlineOutlinedIcon = PersonOutlineIcon

export const LogoutIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </Icon>
)

export const LogoutOutlinedIcon = LogoutIcon

export const AdminPanelSettingsOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3l7 3v5.5c0 4.3-2.9 8-7 9.5-4.1-1.5-7-5.2-7-9.5V6z" />
    <circle cx="12" cy="10.5" r="2" />
    <path d="M8.8 16a3.6 3.6 0 0 1 6.4 0" />
  </Icon>
)

export const SupportAgentOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
    <path d="M3.5 13h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2A1.5 1.5 0 0 1 2 15.5v-1A1.5 1.5 0 0 1 3.5 13z" />
    <path d="M20.5 13h-2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h2a1.5 1.5 0 0 0 1.5-1.5v-1a1.5 1.5 0 0 0-1.5-1.5z" />
    <path d="M19 17v1a3 3 0 0 1-3 3h-2" />
  </Icon>
)

export const VerifiedOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5l2.3 2.1 3.1-.3.9 3 2.7 1.6-1.4 2.8 1.4 2.8-2.7 1.6-.9 3-3.1-.3L12 21.5l-2.3-2.1-3.1.3-.9-3L3 15.1l1.4-2.8L3 9.5l2.7-1.6.9-3 3.1.3z" />
    <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
  </Icon>
)

// --- commerce ----------------------------------------------------------------

export const ShoppingCartOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 3.5h2.2l2.3 11a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 7H6" />
    <circle cx="9.5" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </Icon>
)

export const ShoppingBagOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 7h15l-1 13.5H5.5z" />
    <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" />
  </Icon>
)

export const LocalOfferOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M11 3H4a1 1 0 0 0-1 1v7l9.5 9.5a1.4 1.4 0 0 0 2 0l6-6a1.4 1.4 0 0 0 0-2z" />
    <circle cx="7.5" cy="7.5" r="1.4" />
  </Icon>
)

export const ReceiptLongOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 2.5h12v16l-3-1.5-3 1.5-3-1.5-3 1.5z" />
    <path d="M9 7h6M9 11h6M9 15h3" />
  </Icon>
)

export const CreditCardOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="M2.5 10h19M6 15h3" />
  </Icon>
)

export const MonetizationOnOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.3A2.6 2.6 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1.1 1.8 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2a2.6 2.6 0 0 1-2.5-1.3M12 6.5v11" />
  </Icon>
)

export const AccountBalanceWalletOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h11v4" />
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
    <path d="M21 9v5h-4.5a2.5 2.5 0 0 1 0-5z" />
  </Icon>
)

export const AccountBalanceOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 9.5L12 4l9 5.5" />
    <path d="M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3 20h18" />
  </Icon>
)

export const PaymentsOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="6" width="14" height="9" rx="1.6" />
    <circle cx="9.5" cy="10.5" r="2" />
    <path d="M6 18.5h11a4.5 4.5 0 0 0 4.5-4.5V9" />
  </Icon>
)

export const WalletOutlinedIcon = AccountBalanceWalletOutlinedIcon

export const QrCode2OutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20.5 14v3M14 20.5h7" />
  </Icon>
)

// --- fruit shop specifics ----------------------------------------------------

export const LocalShippingOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 6.5A1.5 1.5 0 0 1 4 5h9.5v11H2.5z" />
    <path d="M13.5 9H17l3.5 3.5V16h-7z" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </Icon>
)

export const AcUnitOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2L3.8 16.8" />
    <path d="M9.5 4.5L12 6l2.5-1.5M9.5 19.5L12 18l2.5 1.5" />
  </Icon>
)

export const ScaleOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.5v17M6 20.5h12M12 6.5l-6 1.5M12 6.5l6 1.5" />
    <path d="M3 13.5a3 3 0 0 0 6 0L6 8zM15 13.5a3 3 0 0 0 6 0L18 8z" />
  </Icon>
)

export const AgricultureOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 9h6l2 5H4z" />
    <circle cx="7" cy="17" r="3.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
    <path d="M13 14h5.5M14 9.5h6" />
  </Icon>
)

export const Inventory2OutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3.5" width="18" height="4.5" rx="1" />
    <path d="M4.5 8v11a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V8" />
    <path d="M10 12h4" />
  </Icon>
)

export const StoreMallDirectoryOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 4h16l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
    <path d="M4.5 11v9h15v-9M9.5 20v-5h5v5" />
  </Icon>
)

export const EventBusyOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9.5h18M8 3v4M16 3v4" />
    <path d="M10 13.5l4 4M14 13.5l-4 4" />
  </Icon>
)

export const RateReviewOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 4.5h17v12h-11L5 20.5v-4H3.5z" />
    <path d="M8 10.5h8M8 13.5h5" />
  </Icon>
)

export const DashboardIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7.5" height="8.5" rx="1.2" />
    <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.2" />
    <rect x="3" y="14.5" width="7.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.2" />
  </Icon>
)

export const BoltIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13.5 2.5L5 13.5h5.5L9.5 21.5 19 10h-5.8z" />
  </Icon>
)

export const PlaceOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10.5" r="2.6" />
  </Icon>
)

export const ReplayOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12a8 8 0 1 0 2.5-5.8" />
    <path d="M3.5 3.5v4h4" />
  </Icon>
)

export const DeleteOutlineIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6.5h16M9.5 6.5V4h5v2.5" />
    <path d="M6.5 6.5l1 13a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9l1-13" />
    <path d="M10.5 10.5v6M13.5 10.5v6" />
  </Icon>
)

export const DeleteOutlineOutlinedIcon = DeleteOutlineIcon

export const CheckCircleOutlineIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.2l2.8 2.8L16 9.5" />
  </Icon>
)

export const DarkModeOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2z" />
  </Icon>
)

export const LightModeOutlinedIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </Icon>
)

// --- brand marks -------------------------------------------------------------

export const FacebookIcon = (props: IconProps) => (
  <SolidIcon {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </SolidIcon>
)

export const InstagramIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8h.01" />
  </Icon>
)

export const LinkedInIcon = (props: IconProps) => (
  <SolidIcon {...props}>
    <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8.3 18.9H5.4V9.7h2.9zM6.9 8.4a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zm12 10.5h-2.9v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.6h-2.9V9.7h2.8V11h.04a3.1 3.1 0 0 1 2.8-1.5c3 0 3.5 2 3.5 4.5z" />
  </SolidIcon>
)

export default Icon
