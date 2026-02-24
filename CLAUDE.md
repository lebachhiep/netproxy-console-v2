# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NetProxy Console V3 — a React SPA serving as the admin/user dashboard for a proxy service platform. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Commands

- **Dev server:** `yarn dev` (runs on port 5192)
- **Build:** `yarn build` (runs `tsc -b && vite build`)
- **Lint:** `yarn lint`
- **Format:** `yarn format` (Prettier)
- **Preview prod build:** `yarn preview`

Commits use conventional commit format (enforced by commitlint via `@commitlint/config-conventional`). Lint-staged runs ESLint with auto-fix + Prettier on staged `.ts`/`.tsx`/`.js`/`.jsx` files via Husky pre-commit hook. Package manager is Yarn 4 (`yarn@4.12.0`).

## Architecture

### Stack

React 19 + TypeScript (strict) + Vite 6 + Tailwind CSS 3 + SCSS. Path alias `@/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

### State Management

- **Zustand** stores in `src/stores/` — `auth.store.ts` (persisted), `branding.store.ts`, `theme.store.ts`, `subscription.store.ts`
- **React Context** for cart (`CartContext`) and navbar (`NavbarContext`) in `src/contexts/`
- **TanStack React Query** for server state/caching

### Routing

React Router v6 in `src/router/index.tsx`. Protected routes wrap `ResponsiveLayout` under `/` via `ProtectedRoute`. Public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`. Navigation sections are defined in `src/config/navigation.tsx` and mapped to page components via a switch in `mapRoutesToComponents`. Route `t` (i18next translation function) is threaded through for localized navigation labels.

### Layouts & Responsive Breakpoints

`src/layouts/ResponsiveLayout.tsx` selects between `AdminLayout`, `TabletLayout`, and `MobileLayout` based on viewport. The `useResponsive` hook (`src/hooks/useResponsive.ts`) defines breakpoints: mobile <600px, tablet 600–1023px, desktop 1024–1439px, large desktop >=1440px. Sidebar becomes absolute-positioned at 1024–1280px. Layout sub-components (Navbar, NavbarMobile, Sidebar, SidebarMobile) live in `src/layouts/components/`.

### API Layer

- **Axios client** configured in `src/config/api.ts` with request/response interceptors (30s timeout)
- Base URL from `VITE_API_BASE_URL` env var (default: staging API)
- Auto-attaches Bearer token; handles 401 with automatic token refresh (deduped via shared promise)
- **`apiService`** singleton in `src/services/api/api.service.ts` wraps the Axios client with typed `get`, `post`, `put`, `patch`, `delete`, `uploadFile`, `downloadFile`, `getPaginated` methods
- Domain services in `src/services/{domain}/` follow the pattern: `{domain}.service.ts` (class with methods using `apiService`), `{domain}.types.ts` (interfaces), optional `{domain}.schemas.ts` (Zod validation). Each service exports a singleton instance (e.g., `export const orderService = new OrderService()`)
- Token management (JWT, dual localStorage/sessionStorage for "remember me") in `src/utils/token.ts`
- Toast notifications for API errors via **Sonner** (`toast.error()` in response interceptor)

### App Bootstrap

`src/index.tsx` → `App.tsx` wrapped in `BrowserRouter`, `AuthProvider`, `GoogleReCaptchaProvider`, `QueryClientProvider`. `AuthProvider` waits for auth store initialization before rendering children. `App.tsx` sets up `CartProvider`, dynamic favicon from branding, and global `Toaster` (Sonner).

### Forms & Validation

React Hook Form with Zod schemas via `@hookform/resolvers`. Validation schemas co-located with services (e.g., `auth.schemas.ts`).

### Styling

Tailwind CSS with class-based dark mode (`darkMode: 'class'`). Custom color palette with semantic tokens (`text-hi`, `text-me`, `bg-primary`, `bg-canvas`, etc.) and their `-dark` variants defined in `tailwind.config.js`. Each color has a base, `-hi` (high contrast), `-border`, and `-bg` variant. Font: Averta CY. Custom font sizes: xs=10px, sm=13px, base=15px, lg=17px. Component-specific styles use SCSS in `src/styles/`.

### i18n

i18next with 13 languages. Translation files at `public/locales/{lang}/translation.json`. Language config in `src/config/constants.ts`, i18next setup in `src/i18n.ts`.

### Dynamic Branding

The app supports per-domain branding (logos, favicon, business name) fetched via branding service and stored in `branding.store.ts`. Theme-aware: serves different logo/icon assets for light vs. dark mode. The `useBranding` hook provides `getCurrentLogo()`, `getCurrentIcon()`, `shouldInvertLogo()`.

### Key Custom Hooks (`src/hooks/`)

- `useAuth` / `useAuthGuard` — auth state and route protection
- `useBranding` — dynamic branding access
- `useTheme` — dark/light mode toggle
- `useCart` — shopping cart state
- `useResponsive` — viewport breakpoint booleans
- `useFilter` — list filtering logic
- `usePayments` — payment method handling
- `useDebounce` / `useClickOutside` / `useURLQuery` / `usePageTitle` — utilities

## Environment Variables

Copy `.env.example` to `.env`. Required:
- `VITE_API_BASE_URL` — API endpoint (default: `https://staging-api.prx.network`)
- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
