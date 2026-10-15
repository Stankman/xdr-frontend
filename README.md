# XdrFrontend

Habbo-style Angular frontend for an existing API and Nitro client. The current
upgrade preserves the NgModule architecture, Habbo assets, navigation, and
light/dark themes. The ACP provides a routed UI skeleton, not administrative
business operations.

## Runtime and UI

- Angular / CLI / CDK **22.2.2**, PrimeNG **22.1.2**, PrimeUI Aura **3.0.1**.
- Tailwind **4.3.3** with the official `tailwindcss-primeui` **0.6.1** integration.
- Node **24.15+ within v24** is recommended (validated with 24.16.0).
  Other supported Node versions are specified in [package.json](./package.json).
- PrimeNG remains styled using Aura tokens; Tailwind replaces PrimeFlex utilities.
  Custom Habbo SCSS and the existing responsive breakpoints remain in use.
- Ubuntu is the UI font, loaded through Google Fonts with a sans-serif fallback.
  Allow `fonts.googleapis.com` styles and `fonts.gstatic.com` fonts in your CSP
  if one is configured. Language flags use the local `flags_responsive.png`
  sprite, not an external image. Text branding is read from
  `environment.app.hotelName`; the existing Habbo image assets are retained.
- The public index includes a responsive illustrated hero, registration call to
  action, feature cards, news, and one recent-users panel. Existing demo users
  remain demo content. Login supports close button, Escape, and mask dismissal;
  mobile navigation follows the selected light/dark theme.
- Public pages, both header rows, and the footer share a centered `web-container`
  capped at 80rem with responsive 1rem-to-3rem side gutters. Forms and article
  text retain their narrower internal reading widths.
- Main navigation uses theme-aware hover, keyboard focus, and current-page
  states. Header rows and desktop menu lists stay transparent over the shared
  header gradient; the mobile menu panel keeps an opaque theme-aware surface.
  Language and theme controls stay transparent and shadow-free at
  rest; the language panel shares the header palette and marks the selected
  language without changing other application menus.
- Header and index entrances use short, staggered bounce animations. News uses
  a card-shaped skeleton only during a pending request, then reveals the result
  or an explicit empty/error state. Entrance animations and skeleton shimmer
  respect `prefers-reduced-motion`.
- Public green buttons share the frontpage finish through `web-green-button`
  in `src/assets/resources/styles/common.scss`: green fill, lime border, rounded
  corners, and a darker hover with a 2px lift over 150ms. Context-specific sizes
  remain unchanged; search keeps its joined left corners. Disabled/loading
  buttons do not lift, and reduced motion removes interactive movement.
  Blue/secondary buttons and text links (including image-led news) are excluded,
  as are the client and administration.
- The avatar-gated `/me` page pairs a profile sidebar with image-led news and
  community/shop navigation. Its avatar keeps the pixel-art display and
  theme-dependent scene gradient. Empty upcoming-feature cards and the
  unbacked VIP-expiration label are not shown; the existing zero-ducket
  placeholder remains until game currency data is integrated.
- News uses responsive, always-readable cards and a dedicated article reading
  layout. Search matches published article titles/descriptions (maximum 80
  characters), with 10 results per page. Applied search and pagination use `q`
  and `page` URL parameters, including reload and Back/Forward restoration.
  Loading, no matches, empty news, and request failures have explicit states
  with retry. Shared slides provide navigation and a pause/resume control;
  reduced-motion preference starts autoplay paused. Hover, touch, keyboard
  focus, and manual slide navigation pause autoplay until explicitly resumed.
  Deploy the matching XDR API public `q` search support before enabling this
  frontend version; older APIs ignore the search parameter.

## ACP structure

- `src/app/modules/shared/layout/acp/` holds the icon rail, contextual
  Discord-channel-style sub-sidebar, and pending-definition workspace.
  The rail groups General, Hotel, and Web/administration. The sub-sidebar shows
  only the selected area's agreed subsections; it collapses below 900px, closes
  on navigation or Escape, and restores focus to its toggle.
- `src/app/modules/acp/modules/` holds lazy-loaded feature modules for dashboard,
  accounts, players, moderation, bans, articles, catalog, currencies, rooms,
  word filters, permissions, audit logs, and settings. Existing achievements and
  subscriptions modules are retained but excluded from this version's menu/routes.
- `acp-sections.ts` defines section labels, groups, submenus, and lazy loaders
  used by both navigation and routing. `/acp` redirects to `/acp/dashboard`.
- Sidebar tooltips work on hover and keyboard focus; the icon rail scrolls on
  shorter screens. Each section has a direct URL and supports browser history.
- Dashboard has four unavailable indicators (players, accounts, online players,
  active reports) and pending recent activity. Normal mode has no fabricated
  records, totals, activity, or successful writes.
- Players and Rooms have list/detail routes with the agreed columns, disabled
  search while unconnected, and all agreed detail panels. Catalog separates
  `pages`, `featured`, and `furniture`; Permissions separates `hotel` and `web`.
  Tables share ten-row pagination and `q`/`page` URL state, including detail
  links and return navigation. These behaviors are exercised with test-only
  records. An opt-in **Demo records** control now previews 24 fictional players,
  24 rooms, three Catalog Pages and one Furniture Definition using the same
  table/search/pagination and detail surfaces. Related demo records are linked.
  A persistent on-screen warning distinguishes these fixtures from real data.
  The toggle is in-memory only, defaults off, and resets on page reload; nothing
  is saved to the backend or browser storage. Editing/saving remain disabled.
  Sections without agreed columns and the Dashboard remain pending, even in
  demo mode. Hide demo records to return immediately to pending integration.
- Currencies, WordFilter, and Bans expose their agreed creation flows. Player
  details link to `/acp/bans/new?player=...`, explicitly without verifying the
  player. Creation fields, editable fields, and ban rules are not yet defined;
  Save and per-record editing/destructive actions remain disabled with an
  explanation. Moderation tickets, Accounts, and permission groups have
  list/detail surfaces but no invented columns or operations.
- `src/app/modules/acp/ui/` contains shared table, record, pending-form, state,
  and feedback components. Pending integration is distinct from pending
  definition, loading, error, empty, no matches, and not found. A direct detail
  URL does not claim that the unverified record exists.
- Currency success feedback is prepared as `CURRENCY_ADDED_MESSAGE` for use
  only after a future successful backend save:
  "Currency added to the database. Add it to `external_variables` to make it available in the hotel."
  No current screen emits this success or performs a write.
- Articles, Audit Logs, Settings (`web`/`hotel`), and Catalog Featured Pages
  remain explicitly pending definition. No transactions are included.
- ACP supporting copy uses the existing English/Spanish translation mechanism.
  Agreed section names remain unchanged.
- Existing route guards are retained. This skeleton does not introduce feature
  authorization or administrative API calls; API permission enforcement remains
  required for future operations. Before integration, inventory actual available
  information and operations, agree on undefined fields/columns/actions, and
  verify access rules. No administrative API or database contracts are implied
  by these view components.

## Local setup

```powershell
npm ci
$env:PRIMEUI_LICENSE = '<your valid PrimeUI license key>'
npm start
```

Open `http://localhost:4200/`. Run commands from the repository root.
PrimeNG 22 requires an appropriate valid PrimeUI license. Follow the vendor's
licensing terms; do not use a placeholder key.

The npm start/build/watch/test prehooks generate
`src/primeui-license.local.ts` from `PRIMEUI_LICENSE`. This file is ignored by Git.
An existing generated key is preserved when the environment variable is absent,
so the variable does not need to remain set for later local runs. To configure or
replace it separately:

```powershell
$env:PRIMEUI_LICENSE = '<your valid PrimeUI license key>'
npm run prebuild
Remove-Item Env:\PRIMEUI_LICENSE
```

Do not share or commit the key or the generated file. CI must supply its own
license through the environment. The key is passed to the client-side PrimeNG
provider and is included in the frontend bundle by the vendor's design: it is
not a server secret, and ignoring the source file does not conceal it from users
of the built app.

## API and client configuration

Update [src/environments/environment.ts](./src/environments/environment.ts) for
your deployment:

- `environment.app.endpoint`: API base URL (currently `http://localhost:9000`).
- `client.nitro.source`: Nitro URL (currently a localhost Nitro installation).
- Hotel branding, image endpoints, default language/theme, and PayPal client ID.

These defaults are development settings, not production-ready endpoints.
Configure HTTPS and the API's CORS rules for the actual website origin.
The current API integration covers email login (`POST /auth/login`), rotating
sessions (`POST /auth/refresh`), logout (`POST /auth/logout`), and the website
account summary (`GET /account`), plus public news (`GET /articles/available` and
`GET /articles/:id`). Successful API responses use the `{ status, code, data }`
envelope. The current API does not expose a user-scoped linked game avatar, so
avatar-dependent pages remain gated and login returns to public news. Shop
payments and Nitro ticket issuance are not connected to the current API yet;
verify those contracts before enabling those flows.

Registration uses `POST /auth/register`, which creates an unverified account and
emails a link to `/verify-email?token=…` (built from the API's `APP_PUBLIC_URL`).
The form then shows a "check your email" state with a resend option
(`POST /auth/email-verification/resend`); it does not start a session. The
`/verify-email` page confirms the token (`POST /auth/email-verification/confirm`),
removes it from the address bar, and offers a resend form if the link is invalid
or expired. Signing in before verifying returns 403, which the sign-in dialog
reports as an unverified email. Password-reset links (`/reset-password?token=…`)
do not have a frontend page yet.

Some legacy services also still target routes absent from the current API:
`GET/POST /config/get`, `POST /rcon/execute`, `GET /shop/offers/all`,
`POST/PUT /shop/purchase`, and `GET /account/ticket`. The API exposes public
settings at `GET /settings/public`, but does not currently provide the legacy
configuration, RCON, or payment routes. Its Turbo ticket route requires a player
ID and a caller's Turbo Admin session; website accounts are not yet linked to
players, so the legacy account ticket call cannot be redirected there safely.

## Build

```powershell
npm run build
```

The application builder writes static files to `dist/xdr-frontend/browser`.
Configure the web server to fall back to `index.html` for Angular routes.
Web pages and the payment dialog are lazy-loaded. The existing **1 MB** initial
bundle error budget is retained; the lower **500 kB** warning threshold and the
`slugify` CommonJS warning still apply.

## Tests

```powershell
npm test
npm test -- --watch=false --browsers=ChromeHeadless
npm ls --depth=0
```

Tests use the existing Jasmine/Karma setup. Headless runs require Chrome;
set `CHROME_BIN` if it is not installed in a standard location.
Regression coverage exercises form validation and submission locking, session
restoration, HTTP errors and credential scoping, logout cleanup, localization,
Nitro lifecycle, article updates/loading, and payment callback ordering.
There is no configured `ng e2e` target.

## Upgrade scope and remaining work

Registration follows the illustrated frontpage design and shares its reduced-motion
aware bounce entrances. Password fields use PrimeNG 22 `pInputPassword` with
accessible visibility buttons and an inline `p-progressbar` strength meter.
The localized strength rating is guidance, not an additional signup requirement;
existing password validation and backend contracts remain unchanged.

### Legal templates

Public, lazy-loaded pages are available at `/terms`, `/privacy`, and `/cookies`.
The footer and registration link to them. Content is currently maintained under
`LEGAL` in `src/assets/lang/en.json` and `src/assets/lang/es.json`; sections are
listed in `src/app/modules/web/modules/legal/legal.component.ts`. ACP content
management is not wired yet and does not require a backend placeholder API.

These are explicitly labelled provisional templates, not final legal documents.
Before publication, complete operator/contact details, jurisdiction, age rules,
purchase/refund terms, data retention, provider and cookie inventories, and have
the text reviewed against actual deployment practices and applicable law.
The cookies page describes known localStorage keys but does not implement cookie
consent, block providers, or claim that the backend/Nitro/third parties set no cookies.

- Email login waits for account loading, surfaces failures, and prevents
  duplicate submissions. The current API returns a website account, not a game
  avatar; avatar-dependent pages stay gated until an authorized link is available.
- Stored sessions are validated and reconciled with the API at startup.
  Logout clears local account/Nitro state even when server logout fails and
  warns that remote logout could not be confirmed.
- Structured HTTP/API failures remain error streams rather than successful
  responses. Authorization is restricted to the configured API; expired access
  tokens are refreshed once and the original request is retried.
- Nitro uses one persistent iframe/ticket per signed-in session, with visible
  failure/retry handling and cleanup on logout.
- News detail updates on route changes, displays API metadata, and redirects
  failed resolution to `/not-found`; the carousel supports loading/error/empty
  states.
- Active Spanish/English UI has locale normalization and menu/date updates.
- PayPal purchase recording is awaited before capture; completion recording
  is awaited after capture. Failures and cancellation are surfaced.

ACP behavior and route policy are unchanged; only Angular-required compatibility
metadata was migrated. Existing placeholder navigation, password recovery,
rankings, demo content, search/pagination, and other unfinished features remain
unfinished intentionally.

Automated tests and browser fixtures do not establish compatibility with your
live backend/emulator or execute real payments. Before deployment, verify real
login/account payloads, SSO issuance, Nitro connectivity, and PayPal integration.
The backend remains responsible for authorization, payment amount/currency
verification, fulfillment, and idempotency.
