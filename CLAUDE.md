# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NetProxy Console V2 — a React SPA serving as the admin/user dashboard for a proxy service platform. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Commands

- **Dev server:** `yarn dev` (runs on port 5192)
- **Build:** `yarn build` (runs `tsc -b && vite build`)
- **Lint:** `yarn lint`
- **Format:** `yarn format` (Prettier)
- **Preview prod build:** `yarn preview`

Commits use conventional commit format (enforced by commitlint). Lint-staged runs ESLint + Prettier on staged `.ts`/`.tsx` files via Husky pre-commit hook.

## Architecture

### Stack

React 19 + TypeScript (strict) + Vite + Tailwind CSS + SCSS. Path alias `@/*` maps to `src/*`.

### State Management

- **Zustand** stores in `src/stores/` — `auth.store.ts`, `branding.store.ts`, `theme.store.ts`, `subscription.store.ts`
- **React Context** for cart (`CartContext`) and navbar (`NavbarContext`) in `src/contexts/`
- **TanStack React Query** for server state/caching

### Routing

React Router v6 in `src/router/index.tsx`. Protected routes wrap `ResponsiveLayout` under `/`. Public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`. Navigation config is in `src/config/navigation.tsx` and routes are mapped to components via a switch in the router.

### Layouts

`src/layouts/ResponsiveLayout.tsx` selects between `AdminLayout`, `TabletLayout`, and `MobileLayout` based on viewport. Layout sub-components (Navbar, Sidebar, etc.) live in `src/layouts/components/`.

### API Layer

- Axios client configured in `src/config/api.ts` with request/response interceptors
- Base URL from `VITE_API_BASE_URL` env var (default: staging API)
- Auto-attaches Bearer token; handles 401 with automatic token refresh (deduped)
- Service modules in `src/services/` follow the pattern: `service.ts` (API calls), `types.ts` (interfaces), `schemas.ts` (Zod validation)
- Token management (JWT, dual localStorage/sessionStorage) in `src/utils/token.ts`

### Forms & Validation

React Hook Form with Zod schemas via `@hookform/resolvers`. Validation schemas co-located with services (e.g., `auth.schemas.ts`).

### Styling

Tailwind CSS with class-based dark mode. Custom color palette with semantic tokens (text-hi, text-me, bg-primary, etc.) defined in `tailwind.config.js`. Font: Averta CY. Component-specific styles use SCSS in `src/styles/`.

### i18n

i18next with 13 languages. Translation files at `public/locales/{lang}/translation.json`. Language config in `src/config/constants.ts`, i18next setup in `src/i18n.ts`.

### Dynamic Branding

The app supports per-domain branding (logos, favicon, business name) fetched via branding service and stored in `branding.store.ts`. Theme-aware: serves different logo/icon assets for light vs. dark mode.

## Environment Variables

Copy `.env.example` to `.env`. Required:
- `VITE_API_BASE_URL` — API endpoint
- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
