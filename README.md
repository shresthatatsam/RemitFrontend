# Remitly Web — React + TypeScript starter

A responsive remittance customer portal UI starter built with React, TypeScript, Vite, React Router and Axios. It is designed to pair with the ASP.NET Core API starter, while using local demo data by default so you can explore the interface before the API workflows are implemented.

## Features in this UI starter

- Public landing page and sign-in / registration screens
- Auth context and protected app routes
- Overview dashboard with recent transfer activity and quick actions
- Identity verification form (UI only; no secure document upload yet)
- Beneficiary management (local demo state)
- Transfer history with status filters and search
- Deposit history and deposit-reference submission (local demo state)
- Responsive desktop/mobile navigation and layouts
- Axios API client with bearer-token interceptor
- Separate feature folders and shared components/types

## Requirements

- Node.js 20 or newer recommended
- npm
- The companion ASP.NET Core API if you want to connect live endpoints

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env
```

The default configuration is demo mode. Login is prefilled with `alex@example.com` / `password123`; in demo mode any valid email and a password of at least 6 characters can log in. An email beginning with `admin` displays the Admin role in the demo. These are **UI demonstration behaviors only**, not authentication or authorization security.

## Connect the ASP.NET Core API

Edit `.env`:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://localhost:7001/api
```

Restart Vite after changing environment variables. The auth adapter currently expects:

- `POST /auth/login` with `{ email, password }`
- `POST /auth/register` with `{ fullName, email, password }`

The login adapter supports a response containing `token` or `accessToken`; it will also look for a `user` object or `userId`/`role` fields. Adjust `src/features/auth/authService.ts` to match the exact API DTOs. Verify the actual API routes and response shapes before connecting.

The other screens currently use sample data and local component state. They do not call API endpoints for KYC, beneficiary persistence, deposits, transfers, admin review, or payout processing yet.

## Architecture

```text
src/
  app/                    App routes and public landing page
  components/
    layout/               Authenticated application shell/navigation
    ui/                   Shared UI components (page header, status badge)
  features/
    auth/                 Auth context, service, login/register screens
    dashboard/            Overview dashboard
    kyc/                  Identity verification form
    beneficiaries/         Beneficiary list and create modal
    transfers/             Transfer history and filtering
    deposits/              Deposit history and reference submission
  lib/                    Shared Axios client and API mode config
  types/                  Shared frontend types
```

## Important production gaps

This is a frontend starter, not a licensed or production-ready money transfer service. Before handling real users or money, implement and test:

- Real backend authentication, email verification, password reset and server-enforced role checks
- KYC API integration, secure document upload/storage, retention controls and audit trails
- Persisted beneficiary validation and bank/account verification where available
- Transfer quote, fee/rate disclosure, transaction creation and idempotency
- Deposit matching and admin-only approval workflow
- Payout provider or controlled manual payout process, reconciliation and transaction audit history
- Country-specific licensing, sanctions screening, AML/CFT, data privacy, complaint handling and security review
- Error boundaries, loading/empty states, automated tests, accessibility review and deployment configuration

Never trust a role stored in local storage or a status shown by the browser. The backend must be the authority for identity, permissions, funds, transfer status and all approvals.
