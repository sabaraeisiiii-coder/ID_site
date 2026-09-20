# ID_site — Frontend UI copy

Source: private `z.ai_project` repository, customer-facing Next.js app (`apps/client`).

## Scope
This destination contains a copied frontend source tree, UI components, design tokens, page layouts and mock-backed UI domain files. The original repository was not modified. API, Gateway, database infrastructure and credentials were not copied. This is a starting copy, **not yet a tested, fully UI-only standalone deliverable**.

## Run (Windows / PowerShell)
```powershell
corepack enable
pnpm install
pnpm dev
```
Frontend is configured for http://localhost:3201.

## Known gaps
- The source repository is private while this destination is public: review visibility before adding any further private files.
- Product and hero WebP/PNG assets are NOT copied; GitHub connector cannot decode the source binary assets. Some images will be missing until those files are transferred.
- API/payment/account domain mock and interaction logic are still present where necessary for rendering the copied pages. It has not been refactored to strictly visual-only components.
- The source was copied without running install, lint, typecheck, build, or browser QA in this destination.
- The previous storefront package manifest still lists legacy dependencies; clean them up after validating actual imports.

No code in the private source repo was changed.
