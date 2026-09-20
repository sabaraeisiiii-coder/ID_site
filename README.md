# ID_site — Independent frontend UI starter

UI-only working copy extracted from `z.ai_project` (source is private). This destination includes a storefront (`apps/client`) and admin dashboard (`apps/dashboard`) as separate Next.js apps, their pages, UI components, shared visual design tokens, RTL Persian styles, and local mock data required to render screens. The source repo was not modified.

## Requirements

Node.js 22+ with Corepack and pnpm 10.17.1.

## Run on Windows (PowerShell)

```powershell
git clone https://github.com/sabaraeisiiii-coder/ID_site.git
cd ID_site
corepack enable
pnpm install --no-frozen-lockfile
pnpm dev:store  # http://localhost:3201
```

Open a second terminal in the same folder and run `pnpm dev:admin` for the admin UI at http://localhost:3101. Or run `pnpm dev:all` for both.

Validation: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## What is intentionally not copied

The original `apps/api`, `apps/gateway`, `prisma`, compose infrastructure, `.env` files, and `src/lib/db.ts` are excluded. No real backend, payments, or authentication are provided; UI pages still include their original local demo/mock interactions and mock domain stores. They do not represent a real online shop.

The original PNG source images are not included because screens reference the lean WebP equivalents, which *are* included in each app. The design assets and pages have been copied, but runtime tests and full browser QA remain to be run in an environment with Node.js / network access. Backend-only dependencies inherited from the source have been removed from both app manifests.

**Visibility:** `ID_site` is currently a public repository, unlike its private source. Switch to Private in GitHub settings if its UI source and graphics are not intended to be public.
